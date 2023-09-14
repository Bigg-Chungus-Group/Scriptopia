import express from "express";
const router = express.Router();
import dashboardHandler from "./dashboardHandler.js";
import profileHandler from "./profileHandler.js";
import certificatesHandler from "./certificatesHandler.js";

router.use("/dashboard", dashboardHandler);
router.use("/profile", profileHandler);
router.use("/certificates", certificatesHandler);


export default router;
