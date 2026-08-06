import { Router } from "express";
import blocksController from "../controllers/blocks.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", blocksController.listBlockedUsers);
router.post("/:userId", blocksController.blockUser);
router.delete("/:userId", blocksController.unblockUser);

export default router;