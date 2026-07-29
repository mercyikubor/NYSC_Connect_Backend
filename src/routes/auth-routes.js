import express from "express";
import {
  registerCorpsMemberController,
  verifyEmailController,
  loginController,
  requestPasswordResetController,
  resetPasswordController,
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

const router = express.Router();

router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController,
);

router.post("/verify-email", verifyEmailValidator, verifyEmailController);

router.post("/login", validateLogin, loginController);

router.post(
  "/password-reset-request",
  validatePasswordResetRequest,
  requestPasswordResetController,
);

router.post("/reset-password", validateResetPassword, resetPasswordController);

//Only corps members
router.get(
  "/corps-dashboard",
  authenticateUser,
  authorizeRoles("Corps_members"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Corps Member",
    });
  },
);

// Only landlords
router.get(
  "/landlord-dashboard",
  authenticateUser,
  authorizeRoles("Landlords"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Landlord",
    });
  },
);

router.post(
  "/password-reset-request",
  validatePasswordResetRequest,
  requestPasswordResetController,
);
export default router;
