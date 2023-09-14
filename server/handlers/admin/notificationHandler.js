import express from "express";
const router = express.Router();
import { notificationDB } from "../../configs/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { ObjectId } from "mongodb";
import { io } from "../../index.js";

router.post("/add", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const { notificationBody, notificationExpiry } = req.body;
    await notificationDB.insertOne({
      body: notificationBody,
      expiry: new Date(notificationExpiry),
    });

    io.emit("onNotification");

    res
      .status(200)
      .send({ status: "success", message: "Notification created" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.get("/receive", async (req, res) => {
  const dateToday = new Date();
  try {
    const notifications = await notificationDB
      .find({ expiry: { $gte: dateToday } })
      .toArray();
    console.log(notifications);
    res.status(200).send({ status: "success", notifications });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.post("/update", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { notificationId, notificationBody, notificationExpiry } = req.body;
  try {
    await notificationDB.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { body: notificationBody, expiry: new Date(notificationExpiry) } }
    );

    io.emit("onNotification");

    res.send({ status: "success", message: "Notification updated" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.post("/delete", verifyToken, verifyAdminPrivilges, async (req, res) => {
  const { notificationId } = req.body;
  try {
    await notificationDB.deleteOne({ _id: new ObjectId(notificationId) });

    io.emit("onNotification");

    res.send({ status: "success", message: "Notification deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

export default router;
