// All imports
import express from "express";

// Contollers Import
import controller from "./../../controllers/index.js";
import { isLoggedIn } from "../../middlewares/auth/auth.js";

// Config
const router = express.Router();

// Create a new user
router.post("/signup", controller?.authController?.signup);

router.post("/signin", controller?.authController?.signin);

router.get("/signout", isLoggedIn, controller?.authController?.signout);

router.get("/", isLoggedIn, controller?.authController?.getAllUsers);

router.get("/:id", isLoggedIn, controller?.authController?.getUser);

// router.patch("/:id/update", controller?.authController?.updateUser);

router.get("/:id/delete", isLoggedIn, controller?.authController?.deleteUser);

export default router;
