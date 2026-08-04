import express from "express";
import { upload } from "../config/cloudinary.js";
import {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  verifyProperty,
} from "../controllers/property-controller.js";

import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";
const router = express.Router();
router.get(
  "/my-properties",
  authenticateUser,
  authorizeRoles("Landlords"),
  getMyProperties
);

router.get("/", getProperties);

router.get("/:id", getPropertyById);

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Landlords"),
  upload.array("images", 5),
  createProperty
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("Landlords"),
  updateProperty
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Landlords"),
  deleteProperty
);

router.patch(
  "/:id/verify",
  authenticateUser,
  authorizeRoles("Admin"),
  verifyProperty
);

export default router;