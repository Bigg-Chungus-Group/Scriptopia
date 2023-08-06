import express from "express";
const router = express.Router();
import { problemDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";


router.get("/:lang/:id", async (req, res) => {
  const id = req.params.id;
  const lang = req.params.lang;
  console.log(lang);
  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const sanitizedId = id.trim();
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
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
