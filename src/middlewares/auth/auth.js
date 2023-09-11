import jwt from "jsonwebtoken";
import User from "../../models/user/user.js";

import { errorResponse } from "./../handlers/response.js";

export function isLoggedIn(req, res, next) {
   const token = req.cookies.token;

   if (!token) {
      return errorResponse(
         res,
         "Unauthorized",
         "Please log in and try again.",
         22,
         401,
      );
   }

   jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedToken) => {
      if (error) {
         return errorResponse(
            res,
            "Unauthorized. Invalid or expired token. Please log in again.",
            error.message,
            33,
            401,
         );
      }

      User.findById(decodedToken.id)
         .then(user => {
            if (!user) {
               return errorResponse(
                  res,
                  "Unauthorized",
                  "User not found. Please log in again.",
                  55,
                  401,
               );
            }

            const { _id, name, username } = user;
            res.locals.user = { _id, name, username };
            next();
         })
         .catch(error => {
            return errorResponse(
               res,
               "Internal Server Error",
               error.message,
               44,
               500,
            );
         });
   });
}
