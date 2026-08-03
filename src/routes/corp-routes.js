import { Router } from "express";
import {
  getAllCorpProfiles,
  getCorpProfile,
  updateCorpProfile,
  deleteCorpProfile,
} from "../controllers/corp-controller.js";
import {
  authenticateUser,
  authorizeRoles,
} from "../middleware/auth-middleware.js";

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
  updateCorpProfile,
);
router.delete(
  "/profile",
  authenticateUser,
  authorizeRoles("Corps_members"),
  deleteCorpProfile,
);

export default router;
