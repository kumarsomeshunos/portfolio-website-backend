// All imports
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./../../models/user/user.js";
import {
   successResponse,
   errorResponse,
} from "./../../middlewares/handlers/response.js";

// Auth helper functions
async function hashPassword(password) {
   if (!password) return null;
   return await bcrypt.hash(password, 14);
}

async function comparePassword(password, hashedPassword) {
   if (!password || !hashedPassword) return null;
   return await bcrypt.compare(password, hashedPassword);
}

async function signJWT(data) {
   if (!data) return null;
   return jwt.sign({ id: data }, process.env.JWT_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "5h",
   });
}

// CRUD

// Create new user
export async function signup(req, res) {
   try {
      const { name, username, password } = req.body;
      const hashedPassword = await hashPassword(password);

      if (!hashedPassword) {
         return errorResponse(
            res,
            "Something wrong with the password :(",
            null,
            12,
            400,
         );
      }

      const user = await new User({
         name,
         username,
         password: hashedPassword,
      }).save();
      const token = await signJWT(user._id);

      res.cookie("token", token);
      return successResponse(res, "Signup successful :)", null, 11, 201, {
         data: { id: user._id, name: user.name, username: user.username },
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         13,
         500,
         { fatal: true },
      );
   }
}

// Login user
export async function signin(req, res) {
   try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
         return errorResponse(
            res,
            "Invalid username or password.",
            null,
            12,
            400,
         );
      }

      const passwordMatch = await comparePassword(password, user.password);

      if (!passwordMatch) {
         return errorResponse(
            res,
            "Invalid username or password.",
            null,
            12,
            400,
         );
      }

      const token = await signJWT(user._id);

      res.cookie("token", token);

      return successResponse(res, "Login successful :)", null, 11, 200, {
         data: { id: user._id, name: user.name, username: user.username },
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         13,
         500,
         { fatal: true },
      );
   }
}

// Logout user
export function signout(req, res) {
   try {
      res.clearCookie("token");
      return successResponse(res, "Signout successful :)", null, 11, 200);
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong during signout :(",
         error.message,
         13,
         500,
         { fatal: true },
      );
   }
}

// Fetch all users
export async function getAllUsers(req, res) {
   try {
      const users = await User.find();

      if (users.length === 0) {
         return errorResponse(
            res,
            "No users found :(",
            "No users found or an error occurred while retrieving data :(",
            1,
            404,
         );
      }

      return successResponse(res, "Users list :)", null, 2, 200, {
         count: users.length,
         data: users,
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         5,
         500,
         { fatal: true },
      );
   }
}

// Fetch one specific user
export async function getUser(req, res) {
   try {
      const id = req.params?.id;
      const user = await User.findById(id);

      if (!user) {
         return errorResponse(
            res,
            "User not found :(",
            `User with id: ${id} not found :(`,
            6,
            404,
         );
      }

      return successResponse(res, "User details :)", null, 7, 200, {
         data: user,
      });
   } catch (error) {
      return errorResponse(
         res,
         "Something went wrong :(",
         error.message,
         9,
         500,
         { fatal: true },
      );
   }
}

// Delete user
export async function deleteUser(req, res) {
   try {
      if (req.query.all === "true") {
         await User.deleteMany({});
         return successResponse(
            res,
            "All users deleted successfully :)",
            null,
            18,
            200,
         );
      } else {
         const id = req.params.id;
         const deletedUser = await User.findByIdAndRemove(id);

         if (!deletedUser) {
            return errorResponse(
               res,
               "User not found.",
               "The specified user does not exist.",
               20,
               404,
            );
         }

         return successResponse(
            res,
            "User deleted successfully.",
            null,
            21,
            200,
            { data: deletedUser },
         );
      }
   } catch (error) {
      return errorResponse(
         res,
         "Internal server error.",
         error.message,
         23,
         500,
      );
   }
}
