export const generateOtp = () => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return {
    otpCode,
    otpExpiresAt,
  };
};
