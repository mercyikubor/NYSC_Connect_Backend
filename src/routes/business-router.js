import express from "express";
import { getNearbyBusinessByGps } from "../controllers/business-controller.js";

const router = express.Router();

router.get("/explore", getNearbyBusinessByGps);

export default router;