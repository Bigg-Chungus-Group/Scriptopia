import express from "express";
const router = express.Router();
import { eventsDB } from "../../configs/mongo.js";
import logger from "../../configs/logger.js";

router.post("/",  async (req, res) => {
  try {
    const events = await eventsDB.find().toArray();
    res.status(200).json(events);
  } catch (err) {
    logger.error({
      code: "ADM-EVH-101",
      message: "Failed to fetch events for " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).json({ message: err.message });
  }
});

export default router;
