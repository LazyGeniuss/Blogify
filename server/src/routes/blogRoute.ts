import { Router } from "express"
import { deleteBlog, editBlog, getAllBlogs, getBlogById, getBlogsByCategroy, getImage, likeBlog, postBlog } from "../controllers/blogController";
import authMiddleWare from "../middlewares/auth";
import optionalAuthMiddleware from "../middlewares/optionalAuth";
import { upload } from "../utils/multer"

const router = Router();

router.get("/getAll", getAllBlogs);

router.get("/category/all", getBlogsByCategroy);

router.get("/:id", optionalAuthMiddleware, getBlogById);

router.get("/image/:id", getImage)

router.post("/create", upload.single("image"), authMiddleWare, postBlog);

router.post("/edit/:id", upload.single("image"), authMiddleWare, editBlog);

router.post("/delete/:id", authMiddleWare, deleteBlog)

router.post("/like/:id", authMiddleWare, likeBlog);

export default router;