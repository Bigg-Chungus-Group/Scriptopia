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

    let hno;
    if(req.user.perms.includes("HC0")) {
      hno = 0;
    } else if(req.user.perms.includes("HC1")) {
      hno = 1;
    } else if(req.user.perms.includes("HC2")) {
      hno = 2;
    } else if(req.user.perms.includes("HC3")) {
      hno = 3;
    }

    const userHouse = await houseDB.findOne({
      no: hno,
    });

    const certifications = await certificationsDB.find({ house: userHouse._id.toString() }).toArray();

    res.status(200).send({ allHouses, userHouse, user, certifications });
  } catch (error) {
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      error: error,
      mid: req.user.mid,
    });
    console.log(error);
    res.status(500).send({ success: false });
  }
});

export default Router;
