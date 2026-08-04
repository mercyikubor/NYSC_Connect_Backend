import {
  registerCorpsMemberController,
  registerLandlordController,
  verifyEmailController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
  loginLandlordController,
} from "../controllers/auth-controller.js";
import {
  validateCorpsMemberRegistration,
  verifyEmailValidator,
  validateLogin,
  validatePasswordResetRequest,
  validateResetPassword,
} from "../validators/auth-validators.js";
import { registerLimiter } from "../middleware/rateLimiter.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";
import express from "express";
import { upload } from "../config/cloudinary.js";
const router = express.Router();
router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController
);

router.post(
  "/verify-email",
  verifyEmailValidator,
  verifyEmailController
);

router.post(
  "/login",
  validateLogin,
  loginController
);

router.post(
  "/register-landlord",
  registerLimiter,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "validId", maxCount: 1 },
  ]),
  registerLandlordController
);

router.post(
  "/login-landlord",
  validateLogin,
  loginLandlordController
);

router.post(
  "/password-reset-request",
  validatePasswordResetRequest,
  requestPasswordResetController
);

router.post(
  "/reset-password",
  validateResetPassword,
  resetPasswordController
);

router.get(
  "/corps-dashboard",
  authenticateUser,
  authorizeRoles("Corps_members"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Corps Member",
    });
  }
);

router.get(
  "/landlord-dashboard",
  authenticateUser,
  authorizeRoles("Landlords"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Landlord",
    });
  }
);

export default router;
