// # Import Modules

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// # Import Handlers

import problemHandler from "./handlers/problemHandler.js";
import loginHandler from "./handlers/loginHandler.js";
import profileHandler from "./handlers/profileHandler.js";
import dashboardHandler from "./handlers/dashboardHandler.js";
import practiceHandler from "./handlers/practiceHandler.js";
import firstTimeHandler from "./handlers/firstTimeHandler.js";

import mainAdmin from "./handlers/admin/main.js";

// # Import Middlewares and APIs

import compiler from "./apis/compiler.js";
import logger from "./configs/logger.js";

// # CONFIGURATIONS, MIDDLEWARES, INITIALIZATIONS

const app = express();
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_ADDRESS,
  credentials: true,
};

console.log(process.env.FRONTEND_ADDRESS);
logger.info(process.env.FRONTEND_ADDRESS);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

// # APIS
app.use("apis/compile", compiler);

// # HANDLERS
app.use("/problem/", problemHandler);
app.use("/auth", loginHandler);
app.use("/profile", profileHandler);
app.use("/dashboard", dashboardHandler);
app.use("/practice", practiceHandler);
app.use("/firstTime", firstTimeHandler);

app.use("/admin", mainAdmin);

app.listen(5000);
