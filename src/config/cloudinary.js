import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "nysc-connect/business-storefronts",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 600, height: 400, crop: "limit", quality: "auto"}]
    }
});

export const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }
})