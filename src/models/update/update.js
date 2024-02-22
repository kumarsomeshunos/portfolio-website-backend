import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
   // Markdown file location
   descriptionMD: {
      type: String,
      required: false,
      maxlength: 200,
   },
   // Date on which the blog is posted (automatic)
   postedOn: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
   },
   // Type of update (backend or frontend)
   type: {
      type: String,
      required: true,
      enum: ["backend", "frontend"],
      default: "frontend",
   },
   // Version of the site
   version: {
      type: String,
      required: true,
      maxlength: 50,
   },
   // Title
   title: {
      type: String,
      required: true,
      maxlength: 100,
   },
});

const Update = mongoose.model("Update", updateSchema);

export default Update;
