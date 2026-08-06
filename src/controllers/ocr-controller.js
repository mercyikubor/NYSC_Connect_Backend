import cloudinary from "../config/cloudinary.js";
import { extractTextFromImage } from "../services/ocr-services.js";
import { parseCallUpLetter } from "../services/callupLetter-Parser.js";

export const extractCallUpDetails = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a Call-Up Letter.",
      });
    }
    const filePath = req.file.path;

    const ocrResult = await extractTextFromImage(filePath);
    const parsedText = ocrResult.ParsedResults?.[0]?.ParsedText || "";
    const extractedData = parseCallUpLetter(parsedText);

    const cloudinaryResult = await cloudinary.uploader.upload(filePath, {
      folder: "call_up_letters",
      resource_type: "auto",
    });
    return res.status(200).json({
      success: true,
      message: "Call-Up Letter processed successfully.",
      cloudinaryUrl: cloudinaryResult.secure_url,
      extractedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process Call-Up Letter.",
    });
  }
};
