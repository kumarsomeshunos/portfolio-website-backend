import mongoose from "mongoose";

// Key-value pair schema (using in different places to store kv pairs)
const keyValuePairSchema = new mongoose.Schema({
   key: {
      type: String,
      required: true,
   },
   value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
   },
});

const blogSchema = new mongoose.Schema({
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
   // Slug name of the blog
   slug: {
      type: String,
      required: true,
      maxlength: 100,
   },
   // Description of the blog (shown in card)
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
   // Should it be visible in blogs tab?
   isVisible: {
      type: Boolean,
      default: true,
      required: true,
   },
   // Key-value pairs of name of the site and link of the site
   // E.g. key: github value: github.com
   tags: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Date on which the blog is posted (automatic)
   postedOn: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
   },
   // Position of the blog in the blogs tab
   position: {
      type: Number,
      validate: {
         validator: value => value >= 0,
         message: "Position must be a non-negative integer",
      },
      max: 10000,
   },
   // ID of the blog (probably serial wise)
   blogID: {
      type: Number,
      required: false,
      max: 10000,
      min: 0,
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
   // View count of the blog (automatic)
   viewCount: {
      type: Number,
      required: true,
      default: 0,
      max: 10000,
   },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
