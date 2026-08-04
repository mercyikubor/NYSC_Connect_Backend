import { Router } from "express";
import {
  getStates,
  getLGAsByState,
} from "../controllers/location-controller.js";

const router = Router();

router.get("/states", getStates);
router.get("/states/:stateId/lgas", getLGAsByState);

export default router;
