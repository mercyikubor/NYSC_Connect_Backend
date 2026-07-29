import { Router } from "express";
import {
  registerCorpsMember,
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

router.post("/register", registerCorpsMember);
router.get(
  "/",
  authenticateUser,
  authorizeRoles("Corps_members"),
  getAllCorpProfiles,
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles("Corps_members"),
  getCorpProfile,
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles("Corps_members"),
  updateCorpProfile,
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Corps_members"),
  deleteCorpProfile,
);

export default router;
