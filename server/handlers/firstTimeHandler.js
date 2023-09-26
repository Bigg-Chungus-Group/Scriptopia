import express from "express";
const Router = express.Router();
import { verifyToken } from "../apis/jwt.js";
import { enrollmentDB, userDB } from "../configs/mongo.js";
import logger from "../configs/logger.js";

Router.post("/", verifyToken, async (req, res) => {
  const { mid, about, technical, projects, certifications, cgpa } = req.body;
  try {
    const user = await userDB.findOne({ mid: mid.toString() });
    if (user) {
      await userDB.updateOne(
        { mid: mid.toString() },
        { $set: { firstTime: false } }
      );
      await enrollmentDB.insertOne({
        mid: mid.toString(),
        about: about.toString(),
        technical: technical.toString(),
        projects: projects.toString(),
        certifications: certifications.toString(),
        cgpa: parseFloat(cgpa),
      });
      res.status(200).send({ success: true });
    } else {
      res.status(500).send({ success: false });
    }
  } catch {
    logger.error({
      code: "MN-FTH-100",
      message: "Error updating first time data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
});

export default Router;
