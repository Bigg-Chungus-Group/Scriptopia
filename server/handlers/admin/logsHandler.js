import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import file from "fs";
import { log } from "console";

router.post("/", verifyToken, verifyAdminPrivilges, (req, res) => {
  file.readFile("./server.log", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      log(err);
      return;
    }
    res.status(200).json({ data: data });
  });
});

export default router;
