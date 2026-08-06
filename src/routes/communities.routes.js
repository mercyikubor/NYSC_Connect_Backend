import { Router } from "express";
import communitiesController from "../controllers/communities.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

// Public reads — no auth required
router.get("/", communitiesController.getByStateAndLga);
router.get("/:communityId", communitiesController.getDetails);
router.get("/:communityId/members", communitiesController.getMembers);

// Requires a logged-in user
router.post("/:communityId/join", verifyJWT, communitiesController.join);
router.post("/:communityId/leave", verifyJWT, communitiesController.leave);

export default router;