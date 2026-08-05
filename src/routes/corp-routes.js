import { Router } from "express";
import {
  getAllCorpProfiles,
  getSingleCorpProfileByAdmin,
  updateCorpProfileByAdmin,
  deleteCorpProfileByAdmin,
  getCorpProfile,
  updateCorpProfile,
} from "../controllers/corp-controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";
import { validateUpdateCorpProfile } from "../validators/corps-validators.js";

const router = Router();

//Admin Routes
router.get("/", authenticateUser, authorizeRoles("Admin"), getAllCorpProfiles);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  getSingleCorpProfileByAdmin,
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  validateUpdateCorpProfile,
  updateCorpProfileByAdmin,
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Admin"),
  deleteCorpProfileByAdmin,
);
// corps member routes
router.get("/profile", authenticateUser, getCorpProfile);
router.put(
  "/profile",
  authenticateUser,
  validateUpdateCorpProfile,
  updateCorpProfile,
);

export default router;
