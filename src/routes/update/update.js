// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import upload from "../../config/multer.js";
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Get all updates
router.get("/", controller?.updateController?.getAllUpdates);

// Create a new update
router.post(
   "/new",
   isLoggedIn,
   upload.single("updateMD"),
   controller?.updateController?.newUpdate,
);

// Delete a project
router.delete(
   "/:id/delete",
   isLoggedIn,
   controller?.updateController?.deleteUpdate,
);

export default router;
