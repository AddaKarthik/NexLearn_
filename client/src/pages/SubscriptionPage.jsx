import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  Award,
  ShieldCheck,
  Zap,
  CreditCard,
  Loader2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadStatus() {
      if (isLoggedIn) {
        try {
          const res = await paymentAPI.getStatus();
          if (res.data.success) {
            setSubStatus(res.data);
          }
        } catch (err) {
          console.warn('Could not load subscription status:', err.message);
        }
      }
      setLoading(false);
    }
    loadStatus();
  }, [isLoggedIn]);

  // Razorpay Checkout handler
  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      // 1. Call backend to create Razorpay Order
      const orderRes = await paymentAPI.createOrder();
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to initialize payment order');
      }

      const { order, keyId, planName } = orderRes.data;

      // 2. Configure Razorpay Checkout options
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_nexlearn123456',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'NexLearn',
        description: planName || 'NexLearn Pro All-Access (30 Days)',
        order_id: order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '9999999999',
        },
        theme: {
          color: '#2563EB',
        },
        handler: async function (response) {
          try {
            // 3. Send payment details to backend for verification
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await refreshUser();
              navigate('/payment/success', {
                state: {
                  receipt: verifyRes.data.payment,
                  user: verifyRes.data.user,
                },
              });
            } else {
              setErrorMessage(verifyRes.data.message || 'Signature verification failed.');
              setProcessing(false);
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setErrorMessage('Payment verification failed on the server.');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      // Check if Razorpay script is loaded in browser
      if (typeof window.Razorpay === 'function') {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setErrorMessage(resp.error.description || 'Payment was declined.');
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback demo simulation if Razorpay checkout script is blocked
        console.warn('Razorpay SDK not found, simulating demo verification for development...');
        const demoVerifyRes = await paymentAPI.verifyPayment({
          razorpay_order_id: order.id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: 'demo_signature_valid',
        });

        if (demoVerifyRes.data.success) {
          await refreshUser();
          navigate('/payment/success', {
            state: {
              receipt: demoVerifyRes.data.payment,
              user: demoVerifyRes.data.user,
            },
          });
        }
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setErrorMessage(err.message || 'Failed to initiate checkout.');
      setProcessing(false);
    }
  };

  const isAlreadyPro = subStatus?.isPremium || user?.isPremium;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Banner */}
      <div className="bg-[#102A43] text-white py-14 sm:py-20 border-b border-blue-900/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#14B8A6]/20 text-[#5EEAD4] border border-[#14B8A6]/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Invest In Your Professional Growth</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Unlock Unlimited Skills with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
              NexLearn Pro All-Access
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain unlimited access to 250+ in-depth courses, recognized credentials, hands-on labs, and expert faculty mentorship.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-16">
        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Learner Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Standard
              </span>
              <h2 className="text-2xl font-black text-[#102A43]">Free Learner</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Great for exploring foundational courses and community resources.
              </p>
              <div className="text-3xl font-black text-[#102A43] pt-2">
                ₹0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Access to all Free Courses in the catalog</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Standard 1080p on-demand video lessons</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Discussion forum reading access</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <span>Accredited graduation certificates</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400 line-through">
                  <span>Downloadable source repositories</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/explore?filter=free')}
              className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors"
            >
              Browse Free Courses
            </button>
          </div>

          {/* Card 2: NexLearn Pro All-Access */}
          <div className="relative bg-gradient-to-b from-white to-blue-50/40 rounded-3xl p-8 border-2 border-[#2563EB] shadow-2xl flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Unlimited Pass
              </span>
              <h2 className="text-2xl font-black text-[#102A43]">NexLearn Pro All-Access</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Complete mastery for ambitious engineers, analysts, and leaders.
              </p>
              <div className="flex items-baseline gap-1.5 pt-2">
                <span className="text-4xl font-black text-[#102A43]">₹199</span>
                <span className="text-xs text-slate-500 font-semibold">/ month • cancel anytime</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-800 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span><strong>Full Catalog:</strong> Unlock all 250+ Pro courses</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span><strong>Accredited Certificates:</strong> Verified credential ID</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span><strong>Project Repos:</strong> Starter and solution code downloads</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span><strong>Priority Faculty Q&A:</strong> Fast replies to questions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <span><strong>Career Roadmaps:</strong> Step-by-step guidance to promotion</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={processing || isAlreadyPro}
              className={`w-full py-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                isAlreadyPro
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isAlreadyPro ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You Are Already a Pro Member</span>
                </>
              ) : (
                <>
                  <span>Join NexLearn Pro Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3. Frequently Asked Questions */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-[#102A43]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">
              Everything you need to know about NexLearn Pro membership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <h4 className="font-bold text-[#102A43]">Can I cancel anytime?</h4>
              <p>
                Yes. You can cancel your membership at any point with one click in your Profile settings. Your access continues through the paid period.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-[#102A43]">Are certificates recognized by employers?</h4>
              <p>
                Yes. NexLearn certificates feature unique verification credential IDs that can be verified online and displayed on LinkedIn.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-[#102A43]">What payment methods are supported?</h4>
              <p>
                We accept all major credit/debit cards, UPI, Google Pay, NetBanking, and digital wallets through Razorpay.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-[#102A43]">Do courses include hands-on projects?</h4>
              <p>
                Every masterclass includes practical coding exercises, lab walkthroughs, and portfolio capstone projects.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
