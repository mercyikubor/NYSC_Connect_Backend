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

router.get("/", authenticateUser, authorizeRoles("Admin"), getAllCorpProfiles);
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("Corps_members"),
  getCorpProfile,
);
router.put(
  "/profile",
  authenticateUser,
  authorizeRoles("Corps_members"),
  validateUpdateCorpProfile,
  updateCorpProfile,
);
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

export default router;
