import express from "express";
import { upload } from "../config/cloudinary.js";

import {
  registerLandlordController,
  loginLandlordController,
  getPendingLandlordsController,
  getLandlordProfileController,
  approveLandlordController,
  rejectLandlordController,
} from "../controllers/landlord-controller.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";

import {
  registerLimiter,
  loginLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

//public routes
// Register Landlord
router.post(
  "/register",
  registerLimiter,
  upload.fields([
    { name: "selfie", maxCount: 1 },
    { name: "validId", maxCount: 1 },
  ]),
  registerLandlordController
);

// Login Landlord
router.post(
  "/login",
  loginLimiter,
  loginLandlordController
);


router.get(
  "/profile/:id",
  authenticateUser,
  authorizeRoles("Landlords"),
  getLandlordProfileController
);

// admin routes

router.get(
  "/pending",
  authenticateUser,
  authorizeRoles("Admin"),
  getPendingLandlordsController
);

// Approve landlord
router.patch(
  "/:id/approve",
  authenticateUser,
  authorizeRoles("Admin"),
  approveLandlordController
);

// Reject landlord
router.patch(
  "/:id/reject",
  authenticateUser,
  authorizeRoles("Admin"),
  rejectLandlordController
);

export default router;