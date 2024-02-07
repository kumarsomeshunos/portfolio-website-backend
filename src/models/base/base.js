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

const baseSchema = new mongoose.Schema({
   // Notification Message
   notificationMessage: {
      type: String,
      required: false,
      maxlength: 500,
   },
   // Navbar
   navbarLinks: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Greetings
   greetings: {
      type: String,
      required: false,
      maxlength: 100,
   },
   // Name
   name: {
      type: String,
      required: false,
      maxlength: 100,
   },
   // Introduction
   introductionMD: {
      type: String,
      required: false,
      maxlength: 200,
   },
   // Buttons below bio
   heroButtons: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Profile Image
   displayProfile: {
      type: String,
      required: false,
   },
   // Projects Heading
   sectionOneHeading: {
      type: String,
      required: false,
      maxlength: 100,
   },
   // Projects Subheading
   sectionOneSubHeading: {
      type: String,
      required: false,
      maxlength: 500,
   },
   // Section One Buttons
   sectionOneButtons: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Blogs Heading
   sectionTwoHeading: {
      type: String,
      required: false,
      maxlength: 100,
   },
   // Blogs Subheading
   sectionTwoSubHeading: {
      type: String,
      required: false,
      maxlength: 500,
   },
   // Section Two Buttons
   sectionTwoButtons: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Social Media Links
   socialLinks: [
      {
         type: keyValuePairSchema,
         required: false,
      },
   ],
   // Ending
   endComment: {
      type: String,
      required: true,
      maxlength: 500,
   },
   // Date on which the base is posted (automatic)
   postedOn: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
   },
   // End comment should be markdown
   // introductionMD: {
   //    type: String,
   //    required: false,
   //    maxlength: 200,
   // },
});

const Base = mongoose.model("Base", baseSchema);

export default Base;
