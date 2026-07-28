import { Router } from "express";
import {
  registerCorpsMember,
  getAllCorpProfiles,
  getCorpProfile,
  updateCorpProfile,
  deleteCorpProfile,
} from "../controllers/corp-controller.js";

const router = Router();

router.post("/register", registerCorpsMember);
router.get("/", getAllCorpProfiles);
router.get("/:id", getCorpProfile);
router.put("/:id", updateCorpProfile);
router.delete("/:id", deleteCorpProfile);

export default router;
