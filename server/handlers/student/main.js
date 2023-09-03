import express from "express";
const router = express.Router();
import dashboardHandler from "./dashboardHandler.js";
import profileHandler from "./profileHandler.js";

router.use("/dashboard", dashboardHandler);
router.use("/profile", profileHandler);


export default router;
