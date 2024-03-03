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

const quoteSchema = new mongoose.Schema({
   // Main Quote
   quote: {
      type: String,
      required: true,
      maxlength: 500,
   },
   // Author
   author: {
      type: String,
      required: true,
      maxlength: 200,
      default: "Unknown",
   },
   // Source
   source: {
      type: String,
      required: false,
      maxlength: 200,
      default: "Unknown",
   },
   // Context
   context: {
      type: String,
      required: false,
      maxlength: 800,
      default: null,
   },
   // Date Added
   postedOn: {
      type: Date,
      required: true,
      default: Date.now,
   },
   // Personal Notes
   personalNotes: {
      type: String,
      required: false,
      maxlength: 800,
      default: null,
   },
   // Tags
   tags: [
      {
         type: String,
         required: false,
         maxlength: 100,
      },
   ],
});

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
