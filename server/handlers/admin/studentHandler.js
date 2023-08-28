import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { houseDB, userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";
import logger from "../../configs/logger.js";
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
        branch: element.branch,
        house: houseID[element.house.id] || "N/A",
      });
    });

    return res
      .status(200)
      .json({ message: "Data fetched successfully", students });
  } catch (error) {
    logger.error("ASH001: ", error);
    return res.status(500).json({ message: "Error in fetching data" });
  }
});

router.post("/import", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { tableData } = req.body;
  const password = await bcrypt.hash(process.env.DEFAULT_STUDENT_PASSWORD, 10);
  let insertData = [];

  try {
    for (let i = 0; i < tableData.length - 1; i++) {
      const mid = tableData[i][0];
      const fname = tableData[i][1];
      const lname = tableData[i][2];
      const gender = tableData[i][3];
      const ay = tableData[i][4];
      const branch = tableData[i][5];
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
        email: "",
        gender,
        ay,
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
      return res.status(200).json({ message: "Data inserted successfully" });
    }
  } catch (error) {
    logger.error("ASH001: ", error);
    return res.status(500).json({ message: "Error in inserting data" });
  }
});

export default router;
