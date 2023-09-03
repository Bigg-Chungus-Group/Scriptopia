import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { houseDB, userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";
import logger from "../../configs/logger.js";
import { Int32, ObjectId } from "mongodb";
import { body } from "express-validator";
const router = express.Router();

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const result = await userDB.find({ role: "S" }).toArray();

    const houses = await houseDB.find().toArray();

    let houseID = {};
    houses.forEach((house) => {
      houseID[house._id] = house.name;
    });

    let students = [];
    result.forEach((element) => {
      students.push({
        mid: element.mid,
        name: `${element.fname} ${element.lname}`,
        year: element.AY,
        dse: element.dse,
        branch: element.branch,
        house: houseID[element.house.id] || "N/A",
        houseID: element.house.id,
        email: element.email,
        gender: element.gender,
      });
    });

    return res
      .status(200)
      .send({ message: "Data fetched successfully", students, houses });
  } catch (error) {
    logger.error("ASH001: ", error);
    return res.status(500).send({ message: "Error in fetching data" });
  }
});

router.post("/import", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { tableData } = req.body;
  const password = await bcrypt.hash(process.env.DEFAULT_STUDENT_PASSWORD, 10);
  let insertData = [];

  try {
    for (let i = 0; i < tableData.length; i++) {
      if (
        tableData[i][0] == "" ||
        tableData[i][1] == "" ||
        tableData[i][2] == "" ||
        tableData[i][3] == ""
      )
        continue;

      const mid = tableData[i][0];
      const fname = tableData[i][1];
      const lname = tableData[i][2];
      const gender = tableData[i][3];
      const email = tableData[i][4];
      const dse = mid.slice(2, 3) == 1 ? false : true;
      const branch = "IT";
      const role = "S";
      const firstTime = true;
      const approved = true;
      const defaultPW = true;

      insertData.push({
        mid,
        password,
        role,
        fname,
        lname,
        profilePicture: "",
        email,
        gender,
        AY: parseInt(20 + mid.slice(0, 2)),
        dse,
        branch,
        house: {
          id: "64eb6fe4826e49f72ada177f",
          contribution: 0,
        },
        rank: {
          alltime: 0,
          monthly: 0,
        },
        badges: [],
        activity: [],
        courses: [],

        firstTime,
        approved,
        defaultPW,
      });
    }
    const result = await userDB.insertMany(insertData);
    if (result) {
      return res.status(200).send({ message: "Data inserted successfully" });
    }
  } catch (error) {
    logger.error("ASH001: ", error);
    return res.status(500).send({ message: "Error in inserting data" });
  }
});

router.post(
  "/add",
  verifyToken,
  verifyAdminPrivilges,
  body("fname").notEmpty().trim().escape(),
  body("lname").notEmpty().trim().escape(),
  body("mid").notEmpty().trim().escape(),
  body("email").notEmpty().trim().escape().isEmail(),
  body("house").notEmpty().trim().escape(),
  body("gender").notEmpty().trim().escape(),
  async (req, res) => {
    const { fname, lname, moodleid: mid, email, house, gender } = req.body;

    const password = bcrypt.hash(process.env.DEFAULT_STUDENT_PASSWORD, 10);
    const firstTime = true;
    const approved = true;
    const defaultPW = true;
    const ay = 20 + mid.slice(0, 2);
    const branch = "IT";
    const dse = mid.slice(2, 3) == 1 ? false : true; //22204016
    const houseContr = 0;

    const userSchema = {
      mid,
      password,
      fname,
      lname,
      profilePicture: "",
      email,
      gender,
      role: "S",
      XP: 0,
      lastOnline: new Date(),
      AY: parseInt(ay),
      dse,
      branch,
      rank: {
        alltime: 0,
        monthly: 0,
      },
      badges: [],
      activity: [],
      courses: [],
      house: {
        id: house,
        contribution: houseContr,
      },
      firstTime,
      approved,
      defaultPW,
    };

    try {
      await userDB.insertOne(userSchema);
      return res.status(200).send({ message: "Data inserted successfully" });
    } catch {
      logger.error("ASH003: ", error);
      return res.status(500).send({ message: "Error in inserting data" });
    }
  }
);

router.post(
  "/update",
  verifyToken,
  verifyAdminPrivilges,
  body("fname").notEmpty().trim().escape(),
  body("lname").notEmpty().trim().escape(),
  body("mid").notEmpty().trim().escape(),
  body("email").notEmpty().trim().escape().isEmail(),
  body("gender").notEmpty().trim().escape(),
  async (req, res) => {
    const { fName, lName, mid, email, house, gender } = req.body;

    try {
      await userDB.updateOne(
        { mid },
        {
          $set: {
            fname: fName,
            lname: lName,
            email,
            house: {
              id: house,
              contribution: 0,
            },
            gender,
          },
        }
      );

      return res.status(200).send({ success: true });
    } catch (error) {
      logger.error("ASH004: ", error);
      return res.status(500).send({ error: "Error in updating data" });
    }
  }
);

router.post(
  "/delete",
  verifyToken,
  verifyAdminPrivilges,
  body("mid").notEmpty().withMessage("Moodle ID is required"),
  async (req, res) => {
    const { mid } = req.body;
    console.log(mid);

    try {
      await userDB.deleteOne({ mid });
      return res.status(200).send({ success: true });
    } catch (error) {
      logger.error("ASH005: ", error);
      return res.status(500).send({ error: "Error in deleting data" });
    }
  }
);

router.post(
  "/bulkdelete",
  verifyToken,
  verifyAdminPrivilges,
  async (req, res) => {
    const { mids } = req.body;
    try {
      await userDB.deleteMany({ mid: { $in: mids } });
      return res.status(200).send({ success: true });
    } catch (error) {
      logger.error("ASH006: ", error);
      return res.status(500).send({ error: "Error in deleting data" });
    }
  }
);

export default router;
