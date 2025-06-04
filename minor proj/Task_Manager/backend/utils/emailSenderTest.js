const sendEmail = require('./emailSender');

const testEmail = async () => {
  try {
    await sendEmail('sherlyyamarthy@gmail.com', 'Test Email from Listify', 'This is a test email to verify email sending functionality.');
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

testEmail();
