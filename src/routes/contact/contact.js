// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import

// Config
const router = express.Router();

// Contact
router.post("/", controller?.contactController?.contact);

export default router;
