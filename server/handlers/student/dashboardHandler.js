import express from "express";
const Router = express.Router();
import {
  houseDB,
  userDB,
  enrollmentDB,
  certificationsDB,
} from "../../configs/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
import logger from "../../configs/logger.js";
import { ObjectId } from "mongodb";

Router.post("/", verifyToken, async (req, res) => {
  try {
    const { mid } = req.body;
    const allHouses = await houseDB.find({}).toArray();
    const user = await userDB.findOne({ mid: mid.toString() });
    const userHouse = await houseDB.findOne({
      _id: new ObjectId(user.house.id),
    });
    const certifications = await certificationsDB.find({ mid }).toArray();

    res.status(200).send({ allHouses, userHouse, user, certifications });
  } catch (error) {
    logger.error(error);
    res.status(500).send({ success: false });
  }
});

Router.post("/firstTime", verifyToken, async (req, res) => {
  const { mid, about, technical, projects, certifications, cgpa } = req.body;

  const user = await userDB.findOne({ mid: mid.toString() });
  if (user) {
    try {
      await userDB.updateOne(
        { mid: mid.toString() },
        { $set: { firstTime: false, approved: false } }
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
    } catch {
      res.status(500).send({ success: false });
    }
  } else {
    res.status(500).send({ success: false });
  }
});

export default Router;
