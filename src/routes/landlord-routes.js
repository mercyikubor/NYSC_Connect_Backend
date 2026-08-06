import express from "express";

import {
  registerLandlordController,
  verifyLandlordEmailController,
  resendLandlordOtpController,
  loginLandlordController,
  requestLandlordPasswordResetController,
  resetLandlordPasswordController,
  approveLandlordController,
  rejectLandlordController,
  getLandlordProfileController,
  updateLandlordProfileController,
  changeLandlordPasswordController,
} from "../controllers/landlord-controller.js";
import { upload } from "../config/cloudinary.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";

const router = express.Router();

// Register landlord
router.post(
  "/register",
  upload.fields([
    {
      name: "selfie",
      maxCount: 1,
    },
    {
      name: "validId",
      maxCount: 1,
    },
  ]),
  registerLandlordController,
);

// Verify email
router.post("/verify-email", verifyLandlordEmailController);

// Login
router.post("/login", loginLandlordController);

router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("Landlord"),
  getLandlordProfileController,
);

router.patch(
  "/profile",
  authenticateUser,
  authorizeRoles("Landlord"),
  updateLandlordProfileController,
);

router.patch(
  "/change-password",
  authenticateUser,
  authorizeRoles("Landlord"),
  changeLandlordPasswordController,
);

// Forgot password
router.post("/forgot-password", requestLandlordPasswordResetController);

// Reset password
router.post("/reset-password", resetLandlordPasswordController);

// Resend verification OTP
router.post("/resend-verification-otp", resendLandlordOtpController);
// Approve landlord (Admin only)
router.patch(
  "/approve/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  approveLandlordController,
);

// Reject landlord (Admin only)
router.patch(
  "/reject/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  rejectLandlordController,
);

export default router;
