// All imports
import multer from "multer";

// Initialize multer diskstorage
const storage = multer.diskStorage({
   destination: function (req, file, callback) {
      // console.log(req.originalUrl);
      if (req.originalUrl.startsWith("/api/portfolio/bases/")) {
         callback(null, "uploads/bases/introduction/");
      } else if (req.originalUrl.startsWith("/api/portfolio/projects/")) {
         callback(null, "uploads/projects/");
      } else if (req.originalUrl.startsWith("/api/portfolio/blogs/")) {
         callback(null, "uploads/blogs/");
      } else {
         callback(null, "uploads/");
         // callback(new Error("Invalid upload path"), false);
      }
   },
   filename: function (req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
   },
});

// Markdown filter setup
const fileFilter = function (req, file, callback) {
   if (file.mimetype?.startsWith("text/")) {
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
