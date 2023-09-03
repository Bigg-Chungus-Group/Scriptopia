import express from "express";
const router = express.Router();
import fetch from "node-fetch";
import { ObjectId } from "mongodb";
import { problemDB } from "../configs/mongo.js";

router.post("", async (req, res) => {
  const { code, lang, input, probId } = req.body;

  const problem = await problemDB.findOne({
    _id: new ObjectId(probId),
    language: lang,
  });

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  problem.testCases.forEach(async (testCase) => {
    const resp = await fetch("https://excompiler.anuragsawant.tech/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language: lang,
        input: testCase.input,
      }),
    });

    resp.json().then(async (data) => {
      console.log(data);
    });
  });
});

export default router;
