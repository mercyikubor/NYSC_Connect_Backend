import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post(
  "/community/:communityId",
  messagesController.sendCommunityMessage
);
router.get("/community/:communityId", messagesController.getCommunityMessages);

router.post("/direct/:receiverId", messagesController.sendDirectMessage);
router.get("/direct/:otherUserId", messagesController.getDirectMessages);

export default router;