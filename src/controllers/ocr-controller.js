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
    const fileUrl = req.file.path;

    const ocrResult = await extractTextFromImage(fileUrl);
    const parsedText = ocrResult.ParsedResults?.[0]?.ParsedText || "";
    const extractedData = parseCallUpLetter(parsedText);

    return res.status(200).json({
      success: true,
      message: "Call-Up Letter processed successfully.",
      file: req.file,
      extractedData: extractedData,
    });
  } catch (error) {
    console.error("Error processing Call-Up Letter:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process Call-Up Letter.",
    });
  }
};
