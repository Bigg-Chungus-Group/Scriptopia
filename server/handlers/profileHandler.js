import express from "express";
const router = express.Router();
import {
  houseDB,
  userDB,
  certificationsDB,
} from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";
import { ObjectId } from "mongodb";

router.post("/:id", async (req, res) => {
  try {
    const mid = req.params.id;
    if(!mid) return res.status(400).send({ success: false, message: "No mid provided" });
    const allHouses = await houseDB.find({}).toArray();
    const user = await userDB.findOne({ mid: mid.toString() });
    const userHouse = await houseDB.findOne({
      _id: new ObjectId(user.house.id),
    });
    const certifications = await certificationsDB.find({ mid }).toArray();
    console.log(user.house.points)

    res.status(200).send({ allHouses, userHouse: user.house, user, certifications });
  } catch (error) {
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
});

router.post("/:id/update", verifyToken, async (req, res) => {
  try {
    const {email, linkedin, github} = req.body 
    const result = await userDB.updateOne({mid: req.user.mid}, {$set: {email, linkedin, github}})
    res.status(200).send({success: true})
  } catch (error) {
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
})

export default router;