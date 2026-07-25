class SmsService {
  async sendSMS(phone, message) {
    try {
      const response = await fetch(
        "https://api.ng.termii.com/api/sms/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: process.env.TERMII_API_KEY,
            to: phone,
            from: "NYSCAPP",
            sms: message,
            type: "plain",
            channel: "generic",
          }),
        }
      );

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async sendOTP(phone, otp) {
    const message = `Your NYSC verification code is ${otp}. Do not share it with anyone.`;
    return this.sendSMS(phone, message);
  }
}

export default new SmsService();