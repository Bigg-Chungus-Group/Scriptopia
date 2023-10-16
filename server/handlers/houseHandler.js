import express from "express";
const router = express.Router();
import { houseDB, userDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";
import { verifyToken } from "../apis/jwt.js";
import jwt from "jsonwebtoken";

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const house = await houseDB.findOne({ _id: new ObjectId(id) });

    if (house) {
      const members = [];

      const memberPromises = house.members.map(async (member) => {
        const memInfo = await userDB.findOne({ mid: member });
        return {
          mid: member,
          fname: memInfo.fname,
          lname: memInfo.lname,
          pfp: memInfo.profilePicture,
          contr: memInfo.house.points,
        };
      });

      const memberResults = await Promise.all(memberPromises);
      const validMembers = memberResults.filter((result) => result !== null);
      members.push(...validMembers);

      const facCord = await userDB.findOne({ mid: house.fc });
      let facCordInfo = null;
      if (facCord) {
        facCordInfo = {
          id: facCord._id,
          fname: facCord.fname,
          lname: facCord.lname,
          pfp: facCord.profilePicture,
          mid: facCord.mid,
        };
      }

      const studentCord = await userDB.findOne({ mid: house.sc });
      let studentCordInfo = null;
      if (studentCord) {
        studentCordInfo = {
          id: studentCord._id,
          fname: studentCord.fname,
          lname: studentCord.lname,
          pfp: studentCord.profilePicture,
          mid: studentCord.mid,
        };
      }

      res.status(200).json({ house, members, facCordInfo, studentCordInfo });
    } else {
      res.status(404).send("House not found");
    }
  } catch (err) {
    res.status(500).send(err);
    logger.error({ code: "HOH100", message: err, err });
  }
});

router.post("/:id/update", verifyToken, async (req, res) => {
  const jwtToken = req.cookies.token;
  const id = req.params.id;

  const { name, fc, sc, color, abstract, desc, hid } = req.body;
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  if (decoded.role !== "A" && !decoded.perms.includes(`HCO${hid}`)) {
    return res
      .status(403)
      .send("You are not authorized to perform this action");
  }

  try {
    await houseDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.toString(),
          fc: fc.toString(),
          sc: sc.toString(),
          color: color.toString(),
          abstract: abstract.toString(),
          desc: desc.toString(),
        },
      }
    );
    res.status(200).send("House updated successfully");
  } catch (error) {
    res.status(500).send("Error updating house");
    logger.error({ code: "HOH101", message: error, error });
  }
});

router.get("/", async (req, res) => {
  try {
    const houses = await houseDB.find({}).toArray();

    res.status(200).json({ houses });
  } catch (error) {
    res.status(500).send("Error adding house");
    logger.error({ code: "HOH102", message: error, error });
  }
});

router.post("/:id/remove", verifyToken, async (req, res) => {
  const jwtToken = req.cookies.token;
  const id = req.params.id;
  const { mid } = req.body;

  const house = await houseDB.findOne({ _id: new ObjectId(id) });
  const hno = house.no;
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  if (decoded.role !== "A" && !decoded.perms.includes(`HCO${hno}`)) {
    return res
      .status(403)
      .send("You are not authorized to perform this action");
  }

  try {
    await houseDB.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { members: mid } }
    );

    res.status(200).send("Member deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting member");
    logger.error({ code: "HOH103", message: error, error });
  }
});

export default router;
