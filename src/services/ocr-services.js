import axios from "axios";
import FormData from "form-data";
import fs from "fs";
export const extractTextFromImage = async (fileUrl) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(fileUrl));
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    const response = await axios.post(
      "https://api.ocr.space/parse/image",
      formData,
      {
        headers: {
          apikey: process.env.OCR_SPACE_API_KEY,
          ...formData.getHeaders(),
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to extract text from image");
  }
};
