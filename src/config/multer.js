// All imports
import multer from "multer";

// Initialize multer diskstorage
const storage = multer.diskStorage({
   destination: function (req, file, callback) {
      callback(null, "uploads/");
   },
   filename: function (req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
   },
});

// Markdown filter setup
const fileFilter = function (req, file, callback) {
   if (file.mimetype.startsWith("text/")) {
      callback(null, true);
   } else {
      callback(new Error("Only markdown files are allowed"), false);
   }
};

const upload = multer({
   storage: storage,
   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
   fileFilter: fileFilter,
});

export default upload;
