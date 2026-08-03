import { Router } from "express";
import postsController from "../controllers/posts.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Public reads
router.get("/community/:communityId", postsController.getCommunityPosts);
router.get("/:postId/comments", postsController.getPostComments);

// Requires auth - membership is checked in the service
router.post("/", verifyJWT, postsController.createPost);
router.post("/:postId/comments", verifyJWT, postsController.createComment);

export default router;