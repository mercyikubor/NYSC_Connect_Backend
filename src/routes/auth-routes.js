import express from "express";
import {
  registerCorpsMemberController,
  verifyEmailController,
} from "../controllers/auth-controller.js";
import {
  validateCorpsMemberRegistration,
  verifyEmailValidator,
} from "../validators/auth-validators.js";
import { registerLimiter } from "../middleware/rateLimiter.js";
import { loginController } from "../controllers/auth-controller.js";
import { validateLogin } from "../validators/auth-validators.js";
import { authenticateUser } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController,
);

router.post("/verify-email", verifyEmailValidator, verifyEmailController);

router.post("/login", validateLogin, loginController);

router.get("/me", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
