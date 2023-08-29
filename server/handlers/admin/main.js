import express from "express";
const router = express.Router();
import studentHandler from "./studentHandler.js";

router.use("/students", studentHandler);

export default router;
