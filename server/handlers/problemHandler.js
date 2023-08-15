import express from "express";
const router = express.Router();
import { problemDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";

router.get("/:lang/:id", async (req, res) => {
  const { id, lang } = req.params;
  const sanitizedId = id.trim();
  if (typeof id !== "string" || sanitizedId === "") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const statement = await problemDB.findOne({
      _id: new ObjectId(sanitizedId),
      language: lang,
    });
    if (!statement) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.json(statement);
  } catch (error) {
    logger.error({ code: "PRH001", message: error.stack });
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
