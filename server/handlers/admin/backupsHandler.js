import express from "express";
const router = express.Router();
import logger from "../../configs/logger.js";
import {
  notificationDB,
  userDB,
  houseDB,
  enrollmentDB,
  certificationsDB,
} from "../../configs/mongo.js";
import fs from "fs";
import jszip from "jszip";

router.post("/", async (req, res) => {
  try {
    const users = await userDB.find({}).toArray();
    const usersJSON = JSON.stringify(users);

    const notifications = await notificationDB.find({}).toArray();
    const notificationsJSON = JSON.stringify(notifications);

    const houses = await houseDB.find({}).toArray();
    const housesJSON = JSON.stringify(houses);

    const enrollments = await enrollmentDB.find({}).toArray();
    const enrollmentsJSON = JSON.stringify(enrollments);

    const certifications = await certificationsDB.find({}).toArray();
    const certificationsJSON = JSON.stringify(certifications);

    fs.writeFileSync("backups/userBackup.json", usersJSON);
    fs.writeFileSync("backups/notificationBackup.json", notificationsJSON);
    fs.writeFileSync("backups/houseBackup.json", housesJSON);
    fs.writeFileSync("backups/enrollmentBackup.json", enrollmentsJSON);
    fs.writeFileSync("backups/certificationBackup.json", certificationsJSON);

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
    logger.info({
      code: "ADM-BKH-100",
      message: "Backup created successfully by " + req.user.mid,
      mid: req.user.mid,
    });
  } catch (err) {
    logger.error({
      code: "ADM-BKH-101",
      message: "Failed to create backup requested by " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
    res
      .status(500)
      .json({ success: false, message: "Failed to create backup" });
  }
});

router.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

export default router;
