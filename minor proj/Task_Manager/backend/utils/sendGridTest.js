const sendEmail = require('./sendGridEmailSender');

(async () => {
  try {
    await sendEmail('ushagondakar@gmail.com', 'Test Email', 'This is a test email from SendGrid setup.');
    console.log('Test email sent successfully.');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
})();
