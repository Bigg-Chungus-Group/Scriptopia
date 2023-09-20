import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";
import logger from "../../configs/logger.js";
const router = express.Router();

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const result = await userDB.find({ role: "F" }).toArray();

    let faculty = [];
    result.forEach((element) => {
      faculty.push({
        mid: element.mid,
        name: `${element.fname} ${element.lname}`,
        branch: element.branch,
      });
    });

    return res
      .status(200)
      .send({ message: "Data fetched successfully", faculty });
  } catch (error) {
    logger.error("ASH001: ", error);
    return res.status(500).send({ message: "Error in fetching data" });
  }
});

router.post("/import", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { tableData } = req.body;
  const password = await bcrypt.hash(process.env.DEFAULT_FACULTY_PASSWORD, 10);
  let insertData = [];

  try {
    for (let i = 0; i < tableData.length; i++) {
      const mid = tableData[i][0];
      const fname = tableData[i][1];
      const lname = tableData[i][2];
      const gender = tableData[i][3];
      const email = tableData[i][4];
      const role = "F";
      const firstTime = true;
      const defaultPW = true;
      const perms = ['VSP', 'VFI']

      insertData.push({
        mid,
        password,
        role,
        fname,
        lname,
        profilePicture: "",
        email,
        gender,
        branch: "IT",
        firstTime,
        defaultPW,
        perms
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

router.post("/add", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { fname, lname, moodleid: mid, email, gender, perms } = req.body;

  const password = bcrypt.hash(process.env.DEFAULT_FACULTY_PASSWORD, 10);
  const firstTime = true;
  const defaultPW = true;
  const branch = "IT";

  const userSchema = {
    mid,
    password,
    fname,
    lname,
    profilePicture: "",
    email,
    gender,
    role: "F",
    XP: 0,
    lastOnline: new Date(),
    branch,
    firstTime,
    defaultPW,
    perms
  };

  try {
    await userDB.insertOne(userSchema);
    return res.status(200).send({ message: "Data inserted successfully" });
  } catch {
    logger.error("ASH003: ", error);
    return res.status(500).send({ message: "Error in inserting data" });
  }
});

router.post("/delete", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { mid } = req.body;
  try {
    await userDB.deleteOne({ mid });
    return res.status(200).send({ success: true });
  } catch (error) {
    logger.error("ASH004: ", error);
    return res.status(500).send({ success: false });
  }
});

export default router;
