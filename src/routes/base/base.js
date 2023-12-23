// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import upload from "../../config/multer.js";
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Get all bases
router.get("/", controller?.baseController?.getAllBases);

// Get a specific base
router.get("/:id", controller?.baseController?.getBase);

// Create a new base
router.post(
   "/new",
   isLoggedIn,
   upload.single("introductionmd"),
   controller?.baseController?.newBase,
);

// Update a base
router.patch(
   "/:id/update",
   isLoggedIn,
   upload.single("introductionmd"),
   controller?.baseController?.updateBase,
);

// Delete a base
router.delete(
   "/:id/delete",
   isLoggedIn,
   controller?.baseController?.deleteBase,
);

export default router;
