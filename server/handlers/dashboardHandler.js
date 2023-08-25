import express from "express";
const Router = express.Router();
import { assignDB, houseDB, problemDB, userDB } from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";
import { ObjectId } from "mongodb";

const getAssign = async (uid) => {
  try {
    return assignDB.find({ assignedStudents: { $in: [uid] } });
  } catch (err) {
    logger.error("DH001", err.stack);
    return { error: "Something went Wrong" };
  }
};

Router.post("/", verifyToken, async (req, res) => {
  const { mid } = req.user;
  const user = await userDB.findOne({ mid });
  const house = await houseDB.findOne({ _id: new ObjectId(user.house.id) });
  const assignments = (await (await getAssign(mid)).toArray()).splice(0, 5);
  const sortedActivity = user.activity.sort((a, b) => b.date - a.date);
  const formattedDateActivity = sortedActivity.map((activity) => {
    const date = new Date(activity.date);
    return {
      ...activity,
      date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
    };
  });

  const userHouse = {
    house,
    contribution: user.house.contribution,
  }

  res.send({ assignments, activity: formattedDateActivity, user, userHouse }); // ! REMOVE UNEEDED COLLECTIONS
});

export default Router;
