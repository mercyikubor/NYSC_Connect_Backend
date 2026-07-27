import express from 'express';
import { createBusiness, getNearbyBusinessByGps } from '../controllers/business.js';

const router = express.Router();

router.post("/register", createBusiness);
router.get("/nearby", getNearbyBusinessByGps);

export default router;