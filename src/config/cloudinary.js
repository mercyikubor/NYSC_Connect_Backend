import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const callUpLetterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "call_up_letters",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
  },
});

const landlordStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nysc-connect/landlord-verification",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 600,
        height: 400,
        crop: "limit",
        quality: "auto",
      },
    ],
  },
});

const uploadCallUpLetter = multer({
  storage: callUpLetterStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("callUpLetter");

const upload = multer({
  storage: landlordStorage,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

export { cloudinary, upload, uploadCallUpLetter };
export default cloudinary;
