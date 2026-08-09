import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  skills: { type: [String], default: [] },
  password: { type: String, required: true },
  image: { type: String, default: "" },
});

export const User = mongoose.model("User", UserSchema);
