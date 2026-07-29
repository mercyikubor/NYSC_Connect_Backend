import express from 'express';
import { createBusiness, getNearbyBusinessByGps } from '../controllers/business.js';
import { uploadImage } from '../config/cloudinary.js';

const router = express.Router();

router.post("/register", uploadImage.single("shopImage"), createBusiness);
router.get("/nearby", getNearbyBusinessByGps);

export default router;