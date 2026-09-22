/**
 * Vercel Serverless Function & Node API endpoint: /api/subscribe
 * Handles user subscription, adds to database/list, and triggers welcome email
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, source } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const sender = process.env.SENDER_EMAIL || 'AIRA Newsletter <onboarding@resend.dev>';
    const leadMagnetUrl = 'https://docs.google.com/spreadsheets/d/190nDBrA-I8J03VlsneEO3U3-z0ERqCfXdF0mwjyKZBY/edit?usp=sharing';

    let emailSent = false;
    let emailError = null;

    if (resendKey) {
      try {
        const welcomeHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px; background: #ffffff;">
          <div style="background: #047857; color: white; padding: 18px 24px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">AIRA Newsletter</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #A7F3D0;">Welcome to Frontier AI Intelligence</p>
          </div>
          <h2 style="color: #0F172A; font-size: 20px;">Welcome to AIRA! ⚡</h2>
          <p style="color: #334155; line-height: 1.6; font-size: 15px;">
            You're now subscribed to daily AI breakthroughs, prompt engineering frameworks, and curated tools.
          </p>
          <div style="background: #ECFDF5; border: 1.5px solid #10B981; border-radius: 8px; padding: 18px; margin: 24px 0; text-align: center;">
            <p style="color: #047857; font-weight: 800; font-size: 12px; margin: 0 0 6px 0; text-transform: uppercase;">🎁 FREE SUBSCRIBER GIFT</p>
            <h3 style="color: #065F46; font-size: 18px; margin: 0 0 12px 0;">AI Automation | 50 n8n Templates</h3>
            <a href="${leadMagnetUrl}" target="_blank" style="display: inline-block; background: #047857; color: white; text-decoration: none; padding: 10px 22px; font-weight: 700; border-radius: 6px;">Access 50 n8n Templates (Google Sheet) ➔</a>
          </div>
          <p style="color: #64748B; font-size: 12px; border-top: 1px solid #F1F5F9; padding-top: 14px; margin-top: 24px;">
            © ${new Date().getFullYear()} AIRA. All rights reserved.
          </p>
        </div>`;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: [cleanEmail],
            subject: '⚡ Welcome to AIRA + Your 50 n8n Templates (Google Sheet)',
            html: welcomeHtml
          })
        });
        emailSent = true;
      } catch (err) {
        emailError = err.message;
      }
    }

    return res.status(200).json({
      success: true,
      email: cleanEmail,
      source: source || 'Website',
      welcomeEmailSent: emailSent,
      leadMagnetUrl
    });

  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
