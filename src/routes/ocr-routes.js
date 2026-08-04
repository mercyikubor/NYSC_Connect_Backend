import express from "express";
import { uploadCallUpLetter } from "../uploads/file-uploads.js";
import { extractCallUpDetails } from "../controllers/ocr-controller.js";

const router = express.Router();

router.post(
  "/callup-letter",
  uploadCallUpLetter,
  extractCallUpDetails,
);

export default router;