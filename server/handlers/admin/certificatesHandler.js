import express from "express";
const router = express.Router();

import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { certificationsDB } from "../../configs/mongo.js";

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const certificates = await certificationsDB.find({}).toArray();
    res.json({ certificates });
  } catch (error) {
    res.json({ error });
  }
});

export default router;
