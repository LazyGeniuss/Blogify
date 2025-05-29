import { NextFunction, Response, Request } from "express";
import User from "../models/User";
import Blog from "../models/Blog";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync();
export const jwtSecret = "qwertytrewq";

interface IGoogleDetail {
  aud: String;
  azp: String;
  email: String;
  email_verified: Boolean;
  exp: Number;
  family_name: String;
  given_name: String;
  iat: Number
  iss: String;
  jti: String;
  name: String;
  nbf: Number;
  picture: String;
  sub: String;
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  if (!/^[A-Za-z]+$/.test(firstName)) {
    res.status(400).send({
      "message": "First name should only contain alphabets"
    })
    return;
  }

  if (!/^[A-Za-z]+$/.test(lastName)) {
    res.status(400).send({
      "message": "Last name should only contain alphabets"
    })
    return;
  }

  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
  ) {
    res.status(400).send({
      "message": "Please enter a valid email"
    })
    return;
  }

  if (password.length < 8) {
    res.status(400).send({
      "message": "Password must be atleast 8 characters long"
    })
    return;
  }

  const response = await User.find({ email });

  if (response.length > 0) {
    res.status(400).send({
      "message": "User already exists"
    })
    return;
  }
  bcrypt.hash(password, salt, async (err: unknown, hash: string) => {
    const user = await User.create({ firstName, lastName, email, password: hash, isSocialLogin: false })

    res.status(200).send({
      "message": "User created!"
    })
    return;
  });
  return;
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
  ) {
    res.status(400).send({
      "message": "Please enter a valid email"
    })
    return;
  }

  if (password.length < 8) {
    res.status(400).send({
      "message": "Password must be atleast 8 characters long"
    })
    return;
  }

  const users = await User.find({ email });
  if (users.length === 0) {
    res.status(400).send({ "message": "User doesn't exist" });
    return;
  }
  const [user] = users;

  bcrypt.compare(password, user.password, async (err: unknown, result: boolean) => {
    if (!result) {
      res.status(400).send({ "message": "Invalid password!" });
      return;
    }

    const token = await jwt.sign(user.toJSON(), jwtSecret);
    res.status(200).send({
      ...user?.toJSON(),
      token
    })
    return;
  })

  return;
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginCreds: IGoogleDetail = jwt.decode(req.body.token);
  const users = await User.find({ email: loginCreds.email });
  if (users.length === 0) {
    const details = { firstName: loginCreds.given_name, lastName: loginCreds.family_name, email: loginCreds.email, isSocialLogin: true };
    await User.create(details);
    const token = await jwt.sign(details, jwtSecret);

    res.status(200).send({
      ...details,
      token,
    })
    return;
  } else {
    const [user] = users;
    const token = await jwt.sign(user.toJSON(), jwtSecret);
    res.status(200).send({
      ...user.toJSON(),
      token,
    })
    return;
  };
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.user;

    const blogs = await Blog.find({ email, isDeleted: false }).sort({ date: -1 });

    const blogsLike = await Blog.find({ likes: email });

    res.status(200).send({
      "data": {
        user: req.user,
        blogs: blogs,
        likedBlogs: blogsLike
      }
    })
    return;
  } catch (e) {
    console.log("e", e);
    res.status(404).send({ message: "Unable find the profile" });
    return;
  }

}