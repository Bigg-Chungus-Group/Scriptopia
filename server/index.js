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

/*const corsOptions = {
  origin: process.env.FRONTEND_ADDRESS,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: "Content-Type"
};*/

console.log(process.env.FRONTEND_ADDRESS);
logger.info(process.env.FRONTEND_ADDRESS);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_ADDRESS);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true)
  next();
});

app.use(cookieParser());
//app.use(cors(corsOptions));
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
