import express from "express";
const router = express.Router();
import { problemDB, userDB } from "../configs/mongo.js";
import { verifyToken } from "./../apis/jwt.js";

const getProblems = async (excludedUIDs) => {
  try {
    const problems = problemDB.aggregate([
      { $match: { _id: { $nin: excludedUIDs } } },
      { $sample: { size: 25 } },
      { $project: { codeTitle: 1, difficultyLevel: 1, language: 1 } },
    ]);

    return problems;
  } catch (err) {
    logger.error({ code: "PH001", message: err.stack });
    return { error: "Something went Wrong" };
  }
};

router.post("/", verifyToken, async (req, res) => {
  const { mid } = req.user;
  const user = await userDB.findOne({ mid });
  const excludedUIDs = user.activity.map((activity) => activity.id);

  const problems = (await (await getProblems(excludedUIDs)).toArray()).splice(
    0,
    25
  );
  res.send({ problems });
});

export default router;
