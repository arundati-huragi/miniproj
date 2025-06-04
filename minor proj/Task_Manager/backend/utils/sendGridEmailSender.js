const sgMail = require('@sendgrid/mail');
require('dotenv').config();

console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html = null) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL, // Verified sender email in SendGrid
    subject,
    text,
  };

  if (html) {
    msg.html = html;
  }

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${to} via SendGrid`);
  } catch (error) {
    console.error(`Error sending email to ${to} via SendGrid:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
