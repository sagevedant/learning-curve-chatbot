/**
 * Notification service — sends email alerts when a new lead is captured.
 */

let resendClient = null;

try {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend email notifications enabled');
  } else {
    console.log('ℹ️  RESEND_API_KEY not set — email notifications disabled');
  }
} catch (err) {
  console.log('ℹ️  Resend not available:', err.message);
}

/**
 * Send email notification for a new lead
 */
async function sendEmailNotification(lead) {
  if (!resendClient) {
    console.log('📧 Email notification skipped (Resend not configured)');
    return null;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@learningcurveschool.com';

  try {
    const { data, error } = await resendClient.emails.send({
      from: 'Curious Learners Bot <onboarding@resend.dev>',
      to: [adminEmail],
      subject: `New Enquiry: ${lead.parent_name} - ${lead.program_interest} - Curious Learners`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF6B6B, #4ECDC4); padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">🏫 New Admission Enquiry!</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">👤 Parent</td><td>${lead.parent_name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">📞 Phone</td><td>${lead.phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">👶 Age Group</td><td>${lead.child_age_group || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">📚 Program</td><td>${lead.program_interest || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">📅 Visit Pref.</td><td>${lead.visit_preference || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">📋 Type</td><td>${lead.inquiry_type || 'visit'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">⏰ Received</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
            <div style="margin-top: 16px; padding: 12px; background: #FF6B6B; color: white; border-radius: 8px; text-align: center;">
              <strong>⚡ Action: Call within 24 hours!</strong>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return null;
    }

    console.log('📧 Email notification sent:', data?.id);
    return data;
  } catch (err) {
    console.error('Email notification failed:', err.message);
    return null;
  }
}

/**
 * Format WhatsApp notification message (for future Twilio integration)
 */
function formatWhatsAppMessage(lead) {
  return `🏫 New Admission Enquiry!
━━━━━━━━━━━━━━
👤 Parent: ${lead.parent_name}
📞 Phone: ${lead.phone}
👶 Child Age: ${lead.child_age_group || 'Not specified'}
📚 Program: ${lead.program_interest || 'Not specified'}
📅 Visit Preference: ${lead.visit_preference || 'Not specified'}
⏰ Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━
Action: Call within 24 hours!`;
}

module.exports = { sendEmailNotification, formatWhatsAppMessage };
