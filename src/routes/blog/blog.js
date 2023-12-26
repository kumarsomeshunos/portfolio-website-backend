// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import upload from "../../config/multer.js";
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Get all blogs
router.get("/", controller?.blogController?.getAllBlogs);

// Get a specific blog
router.get("/:id", controller?.blogController?.getBlog);

// Create a new blog
router.post(
   "/new",
   isLoggedIn,
   upload.single("blogMD"),
   controller?.blogController?.newBlog,
);

// Update a blog
router.patch(
   "/:id/update",
   isLoggedIn,
   upload.single("blogMD"),
   controller?.blogController?.updateBlog,
);

// Delete a blog
router.delete(
   "/:id/delete",
   isLoggedIn,
   controller?.blogController?.deleteBlog,
);

export default router;
