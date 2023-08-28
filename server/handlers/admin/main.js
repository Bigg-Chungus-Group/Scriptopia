import express from "express";
const router = express.Router();
import studentHandler from "./studentHandler.js";
import cors from "cors";

router.use(
  cors({
    origin: process.env.FRONTEND_ADDRESS,
    credentials: true,
  })
);

router.use("/students", studentHandler);

export default router;
