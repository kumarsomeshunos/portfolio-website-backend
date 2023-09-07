// All imports
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

// Routers imports
import ProjectRouter from "./routes/project/project.js";

// Config
process.env.NODE_ENV = "development";

if (process.env.NODE_ENV === "development") {
   dotenv.config({ path: ".env.development" });
} else {
   dotenv.config({ path: ".env.production" });
}

const app = express();

// Main function
async function main() {
   // Mongo Connection
   mongoose
      .connect(process.env.MONGO_URI, {
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
   app.use(morgan(process.env.LOGGING_FORMAT));
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

   // Routes
   app.use("/api/portfolio/projects", ProjectRouter);

   app.get("/healthcheck", (req, res) => {
      res.status(200).json({ status: "OK :)" });
   });

   app.listen(process.env.PORT, () => {
      console.log(`Listening on port: ${process.env.PORT}`);
   });
}

main().catch(error => {
   console.log("Something went wrong in main :(");
   console.log(error);
});
