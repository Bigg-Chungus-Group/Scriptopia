import express from "express";
import bcrypt from "bcrypt";
import { userDB } from "../../configs/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
import logger from "../../configs/logger.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";

export const router = express.Router();
// profileHandler.js
export let maintainanceMode = false;

// Export as a getter
export function getMaintenanceMode() {
  return maintainanceMode;
}

// Set maintainanceMode
export function setMaintenanceMode(mode) {
  maintainanceMode = mode;
}

router.post(
  "/updatePW",
  verifyToken,
  verifyAdminPrivilges,
  async (req, res) => {
    const { oldPass, newPass } = req.body;
    try {
      const verified = req.user;
      console.log(verified.mid);
      const result = await userDB.findOne({ mid: verified.mid });
      if (!result) {
        console.log("no result");
        return res.status(401).send();
      }

      const oldMatch = await bcrypt.compare(oldPass, result.password);
      if (!oldMatch) {
        console.log("old not match");
        return res.status(401).send();
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPass, salt);

      await userDB.updateOne(
        { mid: verified.mid },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json({ success: true });
    } catch (err) {
      logger.error("PRF002: ", err.stack);
      res.status(401).send("Invalid Token");
    }
  }
);

router.post(
  "/maintainanceMode",
  verifyToken,
  verifyAdminPrivilges,
  async (req, res) => {
    const { mode } = req.body;
    console.log("====================================");
    console.log(mode);
    console.log("====================================");
    try {
      maintainanceMode = mode;
      res.status(200).json({ success: true });
      console.log("maintianancemode: " + maintainanceMode);
    } catch (err) {
      logger.error("PRF003: ", err);
      res.status(401).send("Invalid Token");
    }
  }
);

export default router;
