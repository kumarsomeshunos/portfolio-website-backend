// All imports
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

const userSchema = new mongoose.Schema({
   // Name,
   name: {
      type: String,
      required: true,
      maxlength: 40,
   },
   // Username
   username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
   },
   // Password
   password: {
      type: String,
      required: true,
      maxlength: 100,
   },
});

const User = mongoose.model("User", userSchema);

export default User;
