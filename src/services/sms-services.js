import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
   process.env.TWILIO_AUTH_TOKEN
  );

  async function sendSMS(to, message) {
    try {
      const response = await client.messages.create({
        body: `Your NYSC Connect verification code is: ${message}. This code expires in 5 minutes. Please do not share this code with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to,
      });
      console.log('SMS sent successfully:', response.sid);
      console.log('Message SID:', response.sid);

      return response.sid;
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      throw error;
    }
  }
  
  export default { sendSMS };