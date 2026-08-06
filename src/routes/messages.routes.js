import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);


// Community messages
router.post(
  "/community/:communityId",
  messagesController.sendCommunityMessage
);

router.get(
  "/community/:communityId",
  messagesController.getCommunityMessages
);


// Direct messages
router.post(
  "/direct/:receiverId",
  messagesController.sendDirectMessage
);

router.get(
  "/direct/:otherUserId",
  messagesController.getDirectMessages
);


// Chat list
router.get(
  "/chats",
  messagesController.getChats
);


// Search chats
router.get(
  "/chats/search",
  messagesController.searchChats
);


// Search messages inside a conversation
router.get(
  "/direct/:otherUserId/search",
  messagesController.searchMessages
);


// Mark messages as read
router.patch(
  "/direct/:otherUserId/read",
  messagesController.markMessagesAsRead
);


export default router;