// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import upload from "../../config/multer.js";

// Config
const router = express.Router();

// Get all projects
router.get("/", controller.projectController.getAllProjects);

// Get a specific projcet
router.get("/:id", controller.projectController.getProject);

// Create a new project
router.post(
   "/new",
   upload.single("filemd"),
   controller.projectController.newProject,
);

// Update a project
router.patch(
   "/:id/update",
   upload.single("filemd"),
   controller.projectController.updateProject,
);

// Delete a project
router.delete("/:id/delete", controller.projectController.deleteProject);

export default router;
