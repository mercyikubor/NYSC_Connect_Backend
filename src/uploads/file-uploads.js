import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

<<<<<<< HEAD
export const uploadCallUpLetter = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
=======
const upload = multer({ storage });

export const uploadCallUpLetter = upload.single("callUpLetter");

export default upload;
>>>>>>> 8ce52f178994cc9a96a2a9ead2b71e08c3a49a8f
