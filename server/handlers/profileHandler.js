import express from "express";
const router = express.Router();
import { houseDB, userDB, certificationsDB } from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";

const upload = multer({ limits: 8000000 });

router.post("/:id", async (req, res) => {
  try {
    const mid = req.params.id;
    if (!mid)
      return res
        .status(400)
        .send({ success: false, message: "No mid provided" });
    const allHouses = await houseDB.find({}).toArray();
    const user = await userDB.findOne({ mid: mid.toString() });
    const userHouse = await houseDB.findOne({
      _id: new ObjectId(user.house.id),
    });
    const certifications = await certificationsDB.find({ mid }).toArray();

    res
      .status(200)
      .send({ allHouses, userHouse: user.house, user, certifications });
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

router.post("/:id/updatepfp", verifyToken, async (req, res) => {
  const canvas = req.body;
  const timestamp = Math.floor(Date.now() / 1000);

  cloudinary.uploader.upload(
    canvas,
    {
      type: "private",
      folder: "profile_pictures",
      timestamp: timestamp,
      filename_override: `${req.user.mid}`,
      public_id: `${req.user.mid}`,
    },
    async (error, result) => {
      if (error) {
        console.log(error);
        logger.error({
          code: "STU-DSH-101",
          message: "Error uploading profile picture",
          err: error.message,
          mid: req.user.mid,
        });
        res.status(500).send({ success: false });
      } else {
        userDB.updateOne(
          { mid: req.user.mid },
          { $set: { pfp: result.secure_url } }
        );

        await userDB.updateOne(
          { mid: req.user.mid },
          { $set: { profilePicture: result.secure_url } }
        );

        const formNewCookie = {
          mid: req.user.mid,
          fname: req.user.fname,
          lname: req.user.lname,
          ay: req.user.ay,
          branch: req.user.branch,
          picture: result.secure_url,
          role: req.user.role,
        };

        const token = jwt.sign(formNewCookie, process.env.JWT_SECRET);
        const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const expirationDate = new Date(Date.now() + expirationTime);

        res
          .status(200)
          .cookie("token", token, {
            expires: expirationDate,
            domain: process.env.COOKIE_DOMAIN,
          })
          .send({ success: true });
      }
    }
  );
});

router.post("/:id/update", verifyToken, async (req, res) => {
  try {
    const { email, linkedin, github } = req.body;
    const result = await userDB.updateOne(
      { mid: req.user.mid },
      { $set: { email, linkedin, github } }
    );
    res.status(200).send({ success: true });
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

export default router;
