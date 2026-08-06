import express from "express";
import { loginAdminController } from "../controllers/admin-auth-controller.js";

const router = express.Router();

// Admin Login
router.post("/login", loginAdminController);

export default router;
