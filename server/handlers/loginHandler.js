import express from "express";
const router = express.Router();
import logger from "../configs/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDB } from "../configs/mongo.js";
import { body } from "express-validator";

const newDoc = {
  mid: "",
  fname: "",
  lname: "",
  XP: 0,
  lastOnline: {
    $date: Date.now(),
  },
  gender: "",
  AY: new Date().getFullYear(),
  branch: "",
  rank: {
    alltime: 0,
    weekly: 0,
  },
  badges: [],
  activity: [],
  courses: [],
};

router.post(
  "/",
  body("mid").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim(),
  async (req, res) => {
    const { mid, password } = req.body;

    const findUser = await userDB.findOne({ mid });
    if (!findUser) {
      res.status(401).json({ message: "Invalid Credentials" });
      return
    }

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) {
      res.status(401).json({ message: "Invalid Credentials" });
      return
    }

    try {
      const token = jwt.sign(
        {
          mid,
          fname: findUser.fname,
          lname: findUser.lname,
          ay: findUser.AY,
          branch: findUser.branch,
          picture: findUser.profilePicture,
        },
        process.env.JWT_SECRET
      );

      const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      const expirationDate = new Date(Date.now() + expirationTime);

      res
        .status(200)
        .cookie("token", token, { expires: expirationDate })
        .send();
    } catch (err) {
      logger.error("LH01: ", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
