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
} from "../controllers/admin-controller.js";

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRoles("Admin"));

router.get("/dashboard", getDashboardStats);

router.get("/properties", getAllProperties);

router.patch("/properties/:id/verify", verifyProperty);

router.get("/landlords", getAllLandlords);

export default router;