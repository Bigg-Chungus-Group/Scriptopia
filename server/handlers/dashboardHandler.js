import express from "express";
const Router = express.Router();
import { assignDB, problemDB, userDB } from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";

const getAssign = async (uid) => {
  try {
    return assignDB.find({ assignedStudents: { $in: [uid] } });
  } catch (err) {
    logger.error({ code: "DH001", message: err.stack });
    return { error: "Something went Wrong" };
  }
};

const getProblems = async (excludedUIDs) => {
  try {
    const problems = problemDB.aggregate([
      { $match: { _id: { $nin: excludedUIDs } } },
      { $sample: { size: 10 } },
      { $project: { codeTitle: 1, difficultyLevel: 1, language: 1 } },
    ]);

    return problems;
  } catch (err) {
    logger.error({ code: "DH002", message: err.stack });
    return { error: "Something went Wrong" };
  }
};

Router.post("/", verifyToken, async (req, res) => {
  const { mid } = req.user;
  const user = await userDB.findOne({ mid });
  const excludedUIDs = user.activity.map((activity) => activity.id);

  const problems = (await (await getProblems(excludedUIDs)).toArray()).splice(
    0,
    5
  );
  const assignments = (await (await getAssign(mid)).toArray()).splice(0, 5);

  res.send({ problems, assignments });
});

export default Router;
