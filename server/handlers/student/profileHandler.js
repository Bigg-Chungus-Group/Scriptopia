import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { badgeDB, userDB, courseDB, problemDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";
import bcrypt from "bcrypt";

router.post("/", verifyToken, async (req, res) => {
  try {
    const verified = req.user;
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
    logger.error({
      code: "STU-PRF-100",
      message: "Error fetching profile data",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

router.post("/updatePW", verifyToken, async (req, res) => {
  const { oldPass, newPass } = req.body;
  try {
    const verified = req.user;
    const result = await userDB.findOne({ mid: verified.mid });
    if (!result) {
      return res.status(401).send();
    }

    const oldMatch = await bcrypt.compare(oldPass, result.password);
    if (!oldMatch) {
      return res.status(401).send();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await userDB.updateOne(
      { mid: verified.mid },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error({
      code: "STU-PRF-101",
      message: "Error updating password",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

export default router;
