import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import { badgeDB, userDB, courseDB, problemDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";

router.post("/", async (req, res) => {
  const token = req.cookies["token"];
  if (!token) return res.status(401).send();

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const result = await userDB.findOne({ mid: verified.mid });
    if (!result) return res.status(401).send();

    const data = result;
    data.badgesData = [];
    data.courseData = [];
    data.activityData = [];

    for (const badge of result.badges) {
      const badgeInfo = await badgeDB.findOne({ _id: new ObjectId(badge) });
      data.badgesData.push(badgeInfo);
    }

    for (const course of result.courses) {
      const courseInfo = await courseDB.findOne({ _id: new ObjectId(course) });
      data.courseData.push(courseInfo);
    }

    for (const activity of result.activity) {
      const activityInfo = await problemDB.findOne({
        _id: new ObjectId(activity),
      });
      data.activityData.push(activityInfo);
    }

    res.status(200).send(data);
  } catch (err) {
    logger.error("PRF 200 - Error getting profile data: " + err.stack);
    res.status(400).send("Invalid Token");
  }
});

export default router;
