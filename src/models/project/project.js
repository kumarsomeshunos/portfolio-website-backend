import mongoose from "mongoose";

// Key-value pair schema (using in different places to store kv pairs)
const keyValuePairSchema = new mongoose.Schema({
   key: {
      type: String,
      required: false,
   },
   value: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
   },
});

const projectSchema = new mongoose.Schema({
   // Store the author names in an array
   author: [
      {
         type: String,
         required: true,
         default: "Somesh Kumar",
         maxlength: 50,
      },
   ],
   // Store caruousol images path in an array
   carousol: [
      {
         type: String,
         required: false,
         maxlength: 200,
      },
   ],
   // Code name of the project
   codeName: {
      type: String,
      required: true,
      maxlength: 50,
   },
   // Description of the project (shown in card)
   description: {
      type: String,
      required: true,
      maxlength: 500,
   },
   // Markdown file location
   descriptionMD: {
      type: String,
      required: false,
      maxlength: 200,
   },
   // Date on which project finished
   endDate: {
      type: Date,
      required: false,
   },
   // Featured project thumnail
   featuredThumbnail: {
      type: String,
      required: false,
      maxlength: 200,
   },
   // Should it be visible in projects tab?
   isVisible: {
      type: Boolean,
      default: true,
      required: true,
   },
   // License the project is using
   license: {
      type: String,
      required: true,
      maxlength: 50,
   },
   // Key-value pairs of name of the site and link of the site
   // E.g. key: github value: github.com
   links: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Date on which the project is posted (automatic)
   postedOn: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
   },
   // Position of the project in the projects tab
   position: {
      type: Number,
      validate: {
         validator: value => value >= 0,
         message: "Position must be a non-negative integer",
      },
      max: 10000,
   },
   // ID of the project (probably serial wise)
   projectID: {
      type: Number,
      required: false,
      max: 10000,
      min: 0,
   },
   // Starting date of the project
   startDate: {
      type: Date,
      required: false,
   },
   // Current status of the project
   status: {
      type: String,
      enum: ["Completed", "Working"],
      required: true,
      default: "Completed",
   },
   // Subtitle
   subtitle: {
      type: String,
      maxlength: 100,
      required: false,
   },
   // Location of the image of card
   thumbnail: {
      type: String,
      maxlength: 200,
      required: false,
   },
   // Key value pair of technologies used in the project
   // E.g: key: prismic value: image path of prismic
   technologies: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Title
   title: {
      type: String,
      required: true,
      maxlength: 100,
   },
   // Updated on date
   updatedOn: {
      type: Date,
      required: true,
      default: Date.now,
   },
   // Version of the project
   version: {
      type: String,
      required: true,
      maxlength: 50,
   },
   // View count of the project (automatic)
   viewCount: {
      type: Number,
      required: true,
      default: 0,
      max: 10000,
   },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
