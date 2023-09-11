// All imports
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Routers imports
import ProjectRouter from "./routes/project/project.js";
import UserRouter from "./routes/user/user.js";

// Config
process.env.NODE_ENV = "development";

if (process.env?.NODE_ENV === "development") {
   dotenv.config({ path: ".env.development" });
} else {
   dotenv.config({ path: ".env.production" });
}

const app = express();

// Main function
async function main() {
   // Mongo Connection
   mongoose
      .connect(process.env?.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      })
      .then(() => {
         console.log("Connected to MongoDB :)");
      })
      .catch(error => {
         console.log("Error connection to MongoDB :(");
         console.log(error);
      });

   // Middlewares
   app.use(morgan(process.env?.LOGGING_FORMAT));
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));
   app.use(
      cookieParser(process.env.COOKIE_PARSER_SECRET_KEY, {
         cookie: {
            maxAge: 86400000, // (24 hrs)
            // secure: true,
            // httpOnly: true,
         },
      }),
   );

   // Routes
   app.use("/api/portfolio/projects", ProjectRouter);
   app.use("/api/portfolio/users", UserRouter);

   app.get("/healthcheck", (req, res) => {
      res.status(200).json({ status: "OK :)" });
   });

   app.listen(process.env?.PORT, () => {
      console.log(`Listening on port: ${process.env?.PORT}`);
   });
}

main().catch(error => {
   console.log("Something went wrong in main :(");
   console.log(error);
});
