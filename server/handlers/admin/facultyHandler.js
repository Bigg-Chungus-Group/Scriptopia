import express from "express";
import { houseDB, userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";
import logger from "../../configs/logger.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const result = await userDB.find({ role: "F" }).toArray();

    let faculty = [];
    result.forEach((element) => {
      faculty.push({
        mid: element.mid,
        fname: element.fname,
        lname: element.lname,
        email: element.email,
        gender: element.gender,
        id: element._id,
        perms: element.perms,
      });
    });

    const houses = await houseDB.find({}).toArray();
    const h = [houses[0].name, houses[1].name, houses[2].name, houses[3].name];

    return res
      .status(200)
      .send({ message: "Data fetched successfully", faculty, houses: h });
  } catch (error) {
    logger.error({
      code: "ADM-FCH-101",
      message: "Failed to fetch faculty",
      err: error.message,
    });
    return res.status(500).send({ message: "Error in fetching data" });
  }
});

router.get("/houses", async (req, res) => {
  try {
    const houses = await houseDB.find({}).toArray();
    const h = [houses[0].name, houses[1].name, houses[2].name, houses[3].name];

    return res.status(200).send({ houses: h });
  } catch (error) {
    logger.error({
      code: "ADM-FCH-101",
      message: "Failed to fetch faculty",
      err: error.message,
    });
    return res.status(500).send({ message: "Error in fetching data" });
  }
});

router.post("/import", async (req, res) => {
  const { tableData } = req.body;
  const password = await bcrypt.hash(process.env.DEFAULT_FACULTY_PASSWORD, 10);
  let insertData = [];

  try {
    for (const row of tableData) {
      const mid = row[0];
      const fname = row[1];
      const lname = row[2];
      const gender = row[3];
      const email = row[4];
      const role = "F";
      const firstTime = true;
      const defaultPW = true;
      const perms = ["VSP", "VFI"];

      insertData.push({
        mid: mid.toString(),
        password: password.toString(),
        role: role.toString(),
        fname: fname.toString(),
        lname: lname.toString(),
        profilePicture: "",
        email: email.toString(),
        gender: gender.toString(),
        branch: "IT",
        firstTime,
        defaultPW,
        perms: perms,
      });
    }
    const result = await userDB.insertMany(insertData);
    if (result) {
      return res.status(200).send({ message: "Data inserted successfully" });
    }
  } catch (error) {
    logger.error({
      code: "ADM-FCH-102",
      message: "Failed to import faculty",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ message: "Error in inserting data" });
  }
});

router.post("/add", async (req, res) => {
  const { fname, lname, moodleid: mid, email, gender, perms } = req.body;

  const password = await bcrypt.hash(process.env.DEFAULT_FACULTY_PASSWORD, 10);
  const firstTime = true;
  const defaultPW = true;
  const branch = "IT";

  const userSchema = {
    mid: mid.toString(),
    password: password.toString(),
    fname: fname.toString(),
    lname: lname.toString(),
    profilePicture: "",
    email: email.toString(),
    gender: gender.toString(),
    role: "F",
    XP: 0,
    lastOnline: new Date(),
    branch,
    firstTime,
    defaultPW,
    perms: perms,
  };

  try {
    await userDB.insertOne(userSchema);
    return res.status(200).send({ message: "Data inserted successfully" });
  } catch {
    logger.error({
      code: "ADM-FCH-103",
      message: "Failed to add faculty",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ message: "Error in inserting data" });
  }
});

router.post("/delete", async (req, res) => {
  const { mid } = req.body;
  try {
    await userDB.deleteOne({ mid: mid.toString() });
    return res.status(200).send({ success: true });
  } catch (error) {
    logger.error({
      code: "ADM-FCH-104",
      message: "Failed to delete faculty",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ success: false });
  }
});

router.post("/update", async (req, res) => {
  const { id, mid, fname, lname, email, gender, perms } = req.body;
  console.log(perms);
  console.log(id);

  try {
    await userDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          mid: mid.toString(),
          fname: fname.toString(),
          lname: lname.toString(),
          email: email.toString(),
          gender: gender.toString(),
          perms: perms,
        },
      }
    );
    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    logger.error({
      code: "ADM-FCH-105",
      message: "Failed to update faculty",
      err: error,
      mid: req.user.mid,
    });
    return res.status(500).send({ success: false });
  }
});

export default router;
