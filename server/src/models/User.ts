import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  isSocialLogin: { type: Boolean, required: true },
  password: { type: String, required: false },
  profilePic: { type: String, required: false },
})

const User = mongoose.model("Users", userSchema);

export default User;