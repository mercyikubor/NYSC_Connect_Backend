import { Router } from "express";
import groupsController from "../controllers/groups.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", groupsController.createGroup);
router.get("/community/:communityId", groupsController.getGroupsByCommunity);
router.get("/:groupId", groupsController.getDetails);
router.get("/:groupId/members", groupsController.getMembers);
router.post("/:groupId/join", groupsController.join);
router.post("/:groupId/leave", groupsController.leave);

export default router;