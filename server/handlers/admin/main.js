import express from "express";
const router = express.Router();
import studentHandler from "./studentHandler.js";
import facultyHandler from "./facultyHandler.js";
import notificationHandler from "./notificationHandler.js";

router.use("/students", studentHandler);
router.use("/faculty", facultyHandler);
router.use("/notifications", notificationHandler)

export default router;
