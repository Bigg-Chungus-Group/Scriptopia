import express from "express";
const Router = express.Router();
import { verifyToken } from "../apis/jwt.js";
import { enrollmentDB, userDB } from "../configs/mongo.js";

Router.post("/", verifyToken, async (req, res) => {
  const { mid, about, technical, projects, certifications, cgpa } = req.body;

  const user = await userDB.findOne({ mid: mid });
  if (user) {
    try {
      await userDB.updateOne({ mid: mid }, { $set: { firstTime: false } });
      await enrollmentDB.insertOne({
        mid,
        about,
        technical,
        projects,
        certifications,
        cgpa,
      });
      res.status(200).send({ success: true });
    } catch {
      res.status(500).send({ success: false });
    }
  } else {
    res.status(500).send({ success: false });
  }
});

export default Router;
