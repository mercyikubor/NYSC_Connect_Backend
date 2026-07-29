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

const router = express.Router();

router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController,
);

router.post("/verify-email", verifyEmailValidator, verifyEmailController);
export default router;
