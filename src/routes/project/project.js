// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import upload from "../../config/multer.js";
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Get all projects
router.get("/", controller?.projectController?.getAllProjects);

// Get a specific projcet
router.get("/:id", controller?.projectController?.getProject);

// Create a new project
router.post(
   "/new",
   isLoggedIn,
   upload.single("projectMD"),
   controller?.projectController?.newProject,
);

// Update a project
router.patch(
   "/:id/update",
   isLoggedIn,
   upload.single("projectMD"),
   controller?.projectController?.updateProject,
);

// Delete a project
router.delete(
   "/:id/delete",
   isLoggedIn,
   controller?.projectController?.deleteProject,
);

export default router;
