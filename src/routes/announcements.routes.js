import { Router } from "express";
import announcementsController from "../controllers/announcements.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Public read - anyone can see a community's announcements
router.get(
  "/community/:communityId",
  announcementsController.getCommunityAnnouncements
);

// Requires auth - permission (leader/admin) is checked in the service
router.post("/", verifyJWT, announcementsController.createAnnouncement);

export default router;