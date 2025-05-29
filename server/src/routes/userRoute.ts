import { Router } from "express"
import { googleLogin, login, profile, signUp } from "../controllers/userController";
import authMiddleware from "../middlewares/auth";

const router = Router();

router.post("/signup", signUp)

router.post("/login", login)

router.post("/googleLogin", googleLogin)

router.get("/profile", authMiddleware, profile)

export default router;