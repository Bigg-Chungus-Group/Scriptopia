import express from "express";
const router = express.Router();
import { houseDB, certificationsDB, userDB } from "../../configs/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const houses = await houseDB.find({}).toArray();
    console.log(houses);
    const certifications = await certificationsDB
      .find({ submittedYear: currentYear })
      .toArray();
    const certArr = [];
    for (const cert of certifications) {
      const belongsTo = await userDB.findOne({ mid: cert.mid });
      certArr.push({
        ...cert,
        name: belongsTo?.fname || "" + " " + belongsTo?.lname || "",
      });
    }
    
    res.json({ houses, certifications: certArr });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

export default router;
