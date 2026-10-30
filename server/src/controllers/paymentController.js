const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { razorpayInstance, key_id, key_secret, verifyRazorpaySignature } = require('../config/razorpay');
const { sendPaymentReceiptEmail } = require('../config/email');

const SUBSCRIPTION_PRICE = parseInt(process.env.SUBSCRIPTION_PRICE_PAISE || '19900', 10);
const SUBSCRIPTION_DAYS = parseInt(process.env.SUBSCRIPTION_DURATION_DAYS || '30', 10);

/**
 * Create a new Razorpay order for NexLearn Pro membership
 * POST /api/payment/create-order
 */
async function createOrder(req, res) {
  try {
    const user = req.user;
    const amount = SUBSCRIPTION_PRICE;
    const currency = process.env.SUBSCRIPTION_CURRENCY || 'INR';
    const receipt = `nexlearn_rcpt_${Date.now().toString().slice(-8)}`;

    let order;

    try {
      if (razorpayInstance && !key_id.includes('test_cinewave') && !key_id.includes('test_nexlearn')) {
        order = await razorpayInstance.orders.create({
          amount,
          currency,
          receipt,
          notes: {
            userId: user._id.toString(),
            userName: user.name,
            plan: 'NexLearn Pro All-Access Monthly',
          },
        });
      } else {
        order = {
          id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          amount,
          currency,
          receipt,
          status: 'created',
        };
      }
    } catch (rzpError) {
      console.warn('[Razorpay API Warning] Using fallback order generator:', rzpError.message);
      order = {
        id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount,
        currency,
        receipt,
        status: 'created',
      };
    }

    // Record pending payment in MongoDB
    await Payment.create({
      user: user._id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      plan: 'NexLearn Pro All-Access Monthly',
      subscriptionDays: SUBSCRIPTION_DAYS,
    });

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: key_id,
      planName: 'NexLearn Pro All-Access Pass (30 Days)',
    });
  } catch (error) {
    console.error('[CreateOrder Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order: ' + error.message,
    });
  }
}

/**
 * Verify Razorpay payment signature & activate NexLearn Pro subscription
 * POST /api/payment/verify
 */
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing order_id or payment_id for verification.',
      });
    }

    const paymentRecord = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: 'Order record not found.',
      });
    }

    // If signature provided, verify cryptographically
    if (razorpay_signature) {
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      if (!isValid) {
        paymentRecord.status = 'failed';
        await paymentRecord.save();
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid cryptographic signature.',
        });
      }
    }

    // Payment successful!
    paymentRecord.razorpayPaymentId = razorpay_payment_id;
    paymentRecord.razorpaySignature = razorpay_signature || 'demo_signature_valid';
    paymentRecord.status = 'successful';
    await paymentRecord.save();

    // Calculate expiry
    const now = new Date();
    const daysToAdd = paymentRecord.subscriptionDays || SUBSCRIPTION_DAYS;
    const user = await User.findById(req.user._id);

    let newExpiry = new Date();
    if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) > now) {
      newExpiry = new Date(new Date(user.subscriptionExpiry).getTime() + daysToAdd * 86400000);
    } else {
      newExpiry = new Date(now.getTime() + daysToAdd * 86400000);
    }

    user.isPremium = true;
    user.subscriptionExpiry = newExpiry;
    await user.save();

    // Send Receipt Email
    sendPaymentReceiptEmail(user, paymentRecord).catch((err) =>
      console.warn('[Payment] Non-blocking receipt email error:', err.message)
    );

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully! NexLearn Pro is now active.',
      payment: paymentRecord,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPremium: true,
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    console.error('[VerifyPayment Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error verifying payment.',
    });
  }
}

/**
 * Get subscription status of user
 * GET /api/payment/status
 */
async function getSubscriptionStatus(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const hasActive = user.hasActivePremium ? user.hasActivePremium() : user.isPremium;

    const latestPayment = await Payment.findOne({
      user: user._id,
      status: 'successful',
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      isPremium: hasActive,
      subscriptionExpiry: user.subscriptionExpiry,
      daysRemaining: user.subscriptionExpiry
        ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry) - new Date()) / 86400000))
        : 0,
      latestPayment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscription status.',
    });
  }
}

/**
 * Get payment history for the user
 * GET /api/payment/history
 */
async function getPaymentHistory(req, res) {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment history.',
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPaymentHistory,
};
