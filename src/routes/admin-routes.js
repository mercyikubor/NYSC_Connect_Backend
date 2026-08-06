import express from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";

import {
  getAllProperties,
  verifyProperty,
  getAllLandlords,
  getDashboardStats,
  approveLandlord,
  rejectLandlord,
} from "../controllers/admin-controller.js";

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("Admin"));

router.get("/landlords", getAllLandlords);

router.get("/dashboard", getDashboardStats);

router.get("/properties", getAllProperties);

router.patch("/properties/:id/verify", verifyProperty);

router.patch("/landlords/:id/approve", approveLandlord);

router.patch("/landlords/:id/reject", rejectLandlord);

export default router;
