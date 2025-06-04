const sendEmail = require('./sendGridEmailSender');

const testSendGridEmail = async () => {
  try {
    await sendEmail('sherlyyamarthy@gmail.com', 'Test Email from Listify via SendGrid', 'This is a test email to verify SendGrid email sending functionality.');
    console.log('Test SendGrid email sent successfully');
  } catch (error) {
    console.error('Error sending test SendGrid email:', error);
  }
};

testSendGridEmail();
