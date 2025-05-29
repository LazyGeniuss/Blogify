import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, default: new Date() },
  isDeleted: { type: Boolean, default: false },
  likes: { type: [String], default: [] },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: null },
  category: { type: [String], required: true },
})

const Blog = mongoose.model("Blogs", blogSchema);

export default Blog;