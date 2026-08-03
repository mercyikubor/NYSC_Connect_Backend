import multer from "multer";
import path from "path";

const callUpStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/callup-letter/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

export const uploadCallUpLetter = multer({
  storage: callUpStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
