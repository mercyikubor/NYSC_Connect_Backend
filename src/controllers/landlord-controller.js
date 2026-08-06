import {
  registerLandlord,
  verifyLandlordEmail,
  resendLandlordVerificationOtp,
  loginLandlord,
  requestLandlordPasswordReset,
  resetLandlordPassword,
  approveLandlord,
  rejectLandlord,
  getLandlordProfile,
  updateLandlordProfile,
  changeLandlordPassword,
} from "../services/landlord-auth-services.js";

// Register Landlord
export const registerLandlordController = async (req, res, next) => {
  try {
    const result = await registerLandlord(req.body, req.files);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateLandlordProfileController = async (req, res, next) => {
  try {
    const result = await updateLandlordProfile(req.user.landlordId, req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changeLandlordPasswordController = async (req, res, next) => {
  try {
    const result = await changeLandlordPassword(req.user.landlordId, req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// Verify Landlord Email
export const verifyLandlordEmailController = async (req, res, next) => {
  try {
    const result = await verifyLandlordEmail(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Resend Verification OTP
export const resendLandlordOtpController = async (req, res, next) => {
  try {
    const result = await resendLandlordVerificationOtp(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Login
export const loginLandlordController = async (req, res, next) => {
  try {
    const result = await loginLandlord(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// forgot Password
export const requestLandlordPasswordResetController = async (
  req,
  res,
  next,
) => {
  try {
    const result = await requestLandlordPasswordReset(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetLandlordPasswordController = async (req, res, next) => {
  try {
    const result = await resetLandlordPassword(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Admin Approves Landlord
export const approveLandlordController = async (req, res, next) => {
  try {
    const result = await approveLandlord(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Admin Rejects Landlord
export const rejectLandlordController = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    const result = await rejectLandlord(req.params.id, rejectionReason);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLandlordProfileController = async (req, res, next) => {
  try {
    const result = await getLandlordProfile(req.user.landlordId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
