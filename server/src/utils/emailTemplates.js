/**
 * NexLearn HTML Email Templates
 * Brand Palette:
 * Primary: #102A43 | Secondary: #2563EB | Accent: #14B8A6
 */

const baseEmailWrapper = (contentTitle, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${contentTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(16, 42, 67, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #102A43 0%, #2563EB 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #FFFFFF;
      font-size: 26px;
      letter-spacing: 0.5px;
      font-weight: 800;
    }
    .header p {
      margin: 8px 0 0;
      color: #E0E7FF;
      font-size: 14px;
    }
    .body {
      padding: 32px 24px;
      line-height: 1.6;
      color: #334E68;
    }
    .highlight-card {
      background-color: #F0F4F8;
      border-left: 4px solid #2563EB;
      padding: 16px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: #2563EB;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 600;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      padding: 20px 24px;
      text-align: center;
      background-color: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #627D98;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 NexLearn</h1>
      <p>Learn Today. Lead Tomorrow.</p>
    </div>
    <div class="body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} NexLearn Inc. All rights reserved.</p>
      <p>Online courses, professional skills, and career development.</p>
    </div>
  </div>
</body>
</html>
`;

function getWelcomeEmail(userName, role = 'STUDENT') {
  const content = `
    <h2>Welcome to NexLearn, ${userName}! 🚀</h2>
    <p>We are thrilled to welcome you to NexLearn, your destination for world-class technical, creative, and professional learning.</p>
    
    <div class="highlight-card">
      <p style="margin: 0; font-weight: 600; color: #102A43;">Here is what you can do right away:</p>
      <ul style="margin: 8px 0 0; padding-left: 20px;">
        <li>Explore 250+ in-depth courses taught by industry veterans</li>
        <li>Follow structured learning paths for career transformation</li>
        <li>Earn accredited certificates of completion</li>
        <li>Build real-world portfolio projects</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <a href="http://localhost:5173/explore" class="btn">Start Learning Today</a>
    </p>

    <p>Happy learning,<br><strong>The NexLearn Academic Team</strong></p>
  `;
  return {
    subject: 'Welcome to NexLearn — Start Your Learning Journey',
    html: baseEmailWrapper('Welcome to NexLearn', content),
  };
}

function getLoginNotificationEmail(userName, userEmail, clientIp, loginDate = new Date()) {
  const content = `
    <h2>Security Alert: New Sign-in Detected</h2>
    <p>Hello ${userName},</p>
    <p>We noticed a new sign-in to your NexLearn account:</p>
    
    <div class="highlight-card">
      <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${loginDate.toLocaleString()}</p>
      <p style="margin: 4px 0;"><strong>IP Address:</strong> ${clientIp}</p>
      <p style="margin: 4px 0;"><strong>Platform:</strong> NexLearn Web</p>
    </div>

    <p>If this was you, you can safely ignore this message. If you did not initiate this login, please secure your account immediately.</p>
    <p>Best regards,<br>NexLearn Security Team</p>
  `;
  return {
    subject: 'NexLearn Security: New Sign-in Detected',
    html: baseEmailWrapper('Security Alert - NexLearn', content),
  };
}

function getPaymentConfirmationEmail(userName, paymentRecord) {
  const amountFormatted = (paymentRecord.amount / 100).toFixed(2);
  const content = `
    <h2>NexLearn Pro Membership Activated! 🎉</h2>
    <p>Hi ${userName},</p>
    <p>Thank you for subscribing to NexLearn Pro! You now have full access to our entire catalog of masterclasses, hands-on labs, and verified certificates.</p>

    <div class="highlight-card">
      <h3 style="margin-top: 0; color: #102A43;">Transaction Details</h3>
      <p style="margin: 4px 0;"><strong>Plan:</strong> ${paymentRecord.plan || 'NexLearn Pro All-Access Pass'}</p>
      <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${amountFormatted} ${paymentRecord.currency}</p>
      <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${paymentRecord.razorpayPaymentId || 'NEX-PREMIUM'}</p>
      <p style="margin: 4px 0;"><strong>Order ID:</strong> ${paymentRecord.razorpayOrderId}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> Successful ✅</p>
    </div>

    <p style="text-align: center;">
      <a href="http://localhost:5173/my-learning" class="btn">Go to My Learning Dashboard</a>
    </p>

    <p>Thank you for investing in your career with NexLearn!</p>
  `;
  return {
    subject: 'Receipt: NexLearn Pro All-Access Membership',
    html: baseEmailWrapper('Payment Receipt - NexLearn Pro', content),
  };
}

module.exports = {
  getWelcomeEmail,
  getLoginNotificationEmail,
  getPaymentConfirmationEmail,
  getWelcomeEmailHtml: (name) => getWelcomeEmail(name).html,
  getLoginAlertEmailHtml: (name, ip, time) => getLoginNotificationEmail(name, '', ip, time).html,
  getPaymentReceiptEmailHtml: (name, rec) => getPaymentConfirmationEmail(name, rec).html,
};
