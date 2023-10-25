import express from "express";
const router = express.Router();
import { userDB } from "../../configs/mongo.js";

router.post("/", async (req, res) => {
  const { mid } = req.body;

  try {
    await userDB.updateOne(
      { mid },
      {
        $set: {
          defaultPW: true,
        },
      }
    );
    res.status(200).json({ message: "User reset successfully", status: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
