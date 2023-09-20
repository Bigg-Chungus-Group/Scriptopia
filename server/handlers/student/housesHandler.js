import express from "express";
import { houseDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const houses = await houseDB.find({}).toArray();
    res.json(houses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

Router.get("/:id", async (req, res) => {
  try {
    const house = await houseDB.findOne({ _id: new ObjectId(req.params.id) });
    res.json(house);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default Router;
