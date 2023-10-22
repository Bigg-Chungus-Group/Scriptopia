import express from "express";
const router = express.Router();
import { certificationsDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";
import { app } from "../firebase.js";

const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

router.post("/get", async (req, res) => {
  const { id } = req.body;
  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(certificate);
  } catch (error) {
    logger.error({
      code: "STU-CHH-102",
      message: "Certificate with ID " + id + "not found",
      mid: req.user.mid,
      err: error.message,
    });
    res.status(400).send("Certificate not found");
  }
});

export default router;
