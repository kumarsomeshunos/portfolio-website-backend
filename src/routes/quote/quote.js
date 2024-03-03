// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";

// Config import
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Get all quotes
router.get("/", controller?.quoteController?.getAllQuotes);

// Get random quote
router.get("/random", controller?.quoteController?.getRandomQuote);

// Create a new quote
router.post("/new", isLoggedIn, controller?.quoteController?.newQuote);

// Udpate a quote
router.patch(
   "/:id/update",
   isLoggedIn,
   controller?.quoteController?.updateQuote,
);

// Delete a quote
router.delete(
   "/:id/delete",
   isLoggedIn,
   controller?.quoteController?.deleteQuote,
);

export default router;
