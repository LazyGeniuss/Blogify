import Router, { NextFunction, Request, Response } from "express";
import { jwtSecret } from "../controllers/userController";
const jwt = require("jsonwebtoken");

const router = Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  try {
    const resp = await jwt.verify(token?.split(" ").at(1), jwtSecret);
    req.user = resp;
  } catch (e) {
    // res.status(401).send({ "message": "Unauthorised" })
    // return;
  }
  next();
})

export default router;