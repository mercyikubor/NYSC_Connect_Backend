import express from "express";
import { registerCorpsMemberController } from "../controllers/auth-controller.js";
import { validateCorpsMemberRegistration } from "../validators/auth-validators.js";
import { registerLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/register/corps-member",
  registerLimiter,
  validateCorpsMemberRegistration,
  registerCorpsMemberController,
);

export default router;
