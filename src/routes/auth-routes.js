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

const router = express.Router();

router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController,
);

router.post("/verify-email", verifyEmailValidator, verifyEmailController);

router.post("/login", validateLogin, loginController);

export default router;
