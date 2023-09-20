import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { eventsDB } from "../../configs/mongo.js";

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const events = await eventsDB.find().toArray();
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
