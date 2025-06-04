/*const nodemailer = require('nodemailer');

console.log('SMTP Config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const fromName = process.env.EMAIL_FROM_NAME || '';
  const fromEmail = process.env.EMAIL_USER;
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.responseCode) {
      console.error('Response code:', error.responseCode);
    }
  }
};

module.exports = sendEmail;
*/

// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS            // <-- Replace with your email app password (NOT your Gmail password)
  }
});

function sendReminderEmail(to, subject, text) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = sendReminderEmail;
