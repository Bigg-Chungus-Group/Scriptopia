import express from "express";
const router = express.Router();
import db from "../configs/sql.js";
import logger from "../configs/logger.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userDB } from "../configs/mongo.js";

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

router.post("/", (req, res) => {
  const { mid, password } = req.body;

  



  /*
  db.query(
    "SELECT * FROM users WHERE moodle_id = ?",
    [mid],
    async (err, result) => {
      if (err) {
        logger.error("SQL201 - Error querying MySQL: " + err.stack);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        if (result.length === 0) {
          res.status(401).json({ message: "Invalid Credentials" });
        } else {
          const enc = await bcrypt.compare(password, result[0].password);
          if (enc) {
            const result = await userDB.findOne({ mid });
            console.log(result);
            if (!result) {
              newDoc.mid = mid;
              await userDB.insertOne(newDoc);
              const token = jwt.sign(
                {
                  mid,
                  fname: result.fname,
                  lname: result.lname,
                  ay: result.AY,
                  branch: result.branch,
                  picture: result.profilePicture,
                },
                process.env.JWT_SECRET
              );
              res.status(200).cookie("token", token).send();
            } else {
              const token = jwt.sign(
                {
                  mid,
                  fname: result.fname,
                  lname: result.lname,
                  ay: result.AY,
                  branch: result.branch,
                  picture: result.profilePicture,
                },
                process.env.JWT_SECRET
              );
              res.status(200).cookie("token", token).send();
            }
          } else {
            res.status(401).json({ message: "Invalid Credentials" });
          }
        }
      }
    }
  );*/
});

export default router;
