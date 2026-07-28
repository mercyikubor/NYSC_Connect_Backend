import { Router } from "express";
import {
  getAllAlumni,
  getAlumniById,
} from "../controllers/alumniController.js";

const router = Router();

// GET /api/alumni - list all alumni with their posting details
router.get("/", getAllAlumni);

// GET /api/alumni/:userId - single alumnus's posting details
router.get("/:userId", getAlumniById);


export default router;