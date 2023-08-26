import express from "express";
const router = express.Router();
import logger from "../configs/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDB } from "../configs/mongo.js";
import { body } from "express-validator";

router.post(
  "/",
  body("mid").not().isEmpty().trim().escape(),
  body("password").not().isEmpty().trim(),
  async (req, res) => {
    const { mid, password } = req.body;

    const findUser = await userDB.findOne({ mid });
    if (!findUser) {
      res.status(401).json({title: "Invalid Credentials", message: "Please Check Your Credentials and Try Again" });
      return;
    }

    const verify = await bcrypt.compare(password, findUser.password);
    if (!verify) {
      res.status(401).json({title: "Invalid Credentials", message: "Please Check Your Credentials and Try Again" });
      return;
    }

    if (findUser.role == "A") {
      try {
        const token = jwt.sign(
          {
            mid,
            fname: findUser.fname,
            lname: findUser.lname,
            picture: findUser.profilePicture,
          },
          process.env.JWT_SECRET
        );
        const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const expirationDate = new Date(Date.now() + expirationTime);

        res
          .status(200)
          .cookie("token", token, { expires: expirationDate, domain: process.env.COOKIE_DOMAIN  })
          .send({ role: "A" });
      } catch (err) {
        logger.error("LH01: ", err.message);
        res.status(500).json({ title: "Internal Server Error", message: "Please Try Again After Some Time." });
      }
    } else if (findUser.role == "F") {
      const token = jwt.sign(
        {
          mid,
          fname: findUser.fname,
          lname: findUser.lname,
          picture: findUser.profilePicture,
        },
        process.env.JWT_SECRET
      );
      const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      const expirationDate = new Date(Date.now() + expirationTime);

      res
        .status(200)
        .cookie("token", token, { expires: expirationDate, domain: process.env.COOKIE_DOMAIN })
        .send({ role: "F" });
    } else if (findUser.role == "S") {
      try {
        if (findUser.approved === false) {
          res.status(401).json({ title: "Not Alloted", message: "You have been not alloted to any house yet. Please try again after a while." });
          return;
        }

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
          .cookie("token", token, { expires: expirationDate, domain: process.env.COOKIE_DOMAIN  })
          .send({ role: "S" });
      } catch (err) {
        logger.error("LH01: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
);

export default router;
