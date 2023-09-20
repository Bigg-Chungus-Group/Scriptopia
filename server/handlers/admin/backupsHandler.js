import express from "express";
const router = express.Router();

import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import {
  notificationDB,
  userDB,
  houseDB,
  enrollmentDB,
  certificationsDB,
} from "../../configs/mongo.js";
import fs from "fs";
import jszip from "jszip";
import e from "express";

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  //generate backup of all databases.

  const users = await userDB.find({}).toArray();
  const usersJSON = JSON.stringify(users);

  const notifications = await notificationDB.find({}).toArray();
  const notificationsJSON = JSON.stringify(notifications);

  const houses = await houseDB.find({}).toArray();
  const housesJSON = JSON.stringify(houses);

  const enrollments = await enrollmentDB.find({}).toArray();
  const enrollmentsJSON = JSON.stringify(enrollments);
  console.log(enrollmentsJSON);

  const certifications = await certificationsDB.find({}).toArray();
  const certificationsJSON = JSON.stringify(certifications);

  const userBackup = fs.writeFileSync("backups/userBackup.json", usersJSON);
  const notificationBackup = fs.writeFileSync(
    "backups/notificationBackup.json",
    notificationsJSON
  );
  const houseBackup = fs.writeFileSync("backups/houseBackup.json", housesJSON);
  const enrollmentBackup = fs.writeFileSync(
    "backups/enrollmentBackup.json",
    enrollmentsJSON
  );
  const certificationBackup = fs.writeFileSync(
    "backups/certificationBackup.json",
    certificationsJSON
  );

  const zip = new jszip();
  zip.file("backups/userBackup.json", usersJSON);
  zip.file("backups/notificationBackup.json", notificationsJSON);
  zip.file("backups/houseBackup.json", housesJSON);
  zip.file("backups/enrollmentBackup.json", enrollmentsJSON);
  zip.file("backups/certificationBackup.json", certificationsJSON);
  const content = await zip.generateAsync({ type: "nodebuffer" });

  fs.writeFileSync("backups/backup.zip", content);

  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", "attachment; filename=backup.zip");
  res.set("Content-Length", content.length);
  res.send(content);

  // res.status(200).json({ success: true });
});

router.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

export default router;
