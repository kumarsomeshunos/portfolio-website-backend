// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config
const router = express.Router();

// Test routes
router.get("/top-tracks", controller?.testController?.readTopTracks);

export default router;
