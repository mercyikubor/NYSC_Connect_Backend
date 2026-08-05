import {
  registerLandlord,
  loginLandlord,
  getPendingLandlords,
  approveLandlord,
  rejectLandlord,
  getLandlordProfile,
} from "../services/landlord-auth-services.js";

// Register Landlord
export const registerLandlordController = async (req, res) => {
  try {
    const result = await registerLandlord(req.body, req.files);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Landlord
export const loginLandlordController = async (req, res) => {
  try {
    const result = await loginLandlord(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all pending landlords (Admin)
export const getPendingLandlordsController = async (req, res) => {
  try {
    const landlords = await getPendingLandlords();

    return res.status(200).json({
      success: true,
      count: landlords.length,
      data: landlords,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get landlord profile
export const getLandlordProfileController = async (req, res) => {
  try {
    const landlord = await getLandlordProfile(req.params.id);

    return res.status(200).json({
      success: true,
      data: landlord,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve landlord (Admin)
export const approveLandlordController = async (req, res) => {
  try {
    const result = await approveLandlord(
      req.params.id,
      req.user.userId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject landlord (Admin)
export const rejectLandlordController = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "you must provide a rejection reason when rejecting a landlord.",
      });
    }

    const result = await rejectLandlord(
      req.params.id,
      rejectionReason,
      req.user.userId
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};