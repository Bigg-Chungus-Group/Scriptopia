// # Import Modules

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cors from "cors";

// # Import Handlers

import loginHandler from "./handlers/loginHandler.js";
import firstTimeHandler from "./handlers/firstTimeHandler.js";

import mainAdmin from "./handlers/admin/main.js";
import mainStudent from "./handlers/student/main.js";
import mainFaculty from "./handlers/faculty/main.js";
import { getMaintenanceMode } from "./handlers/admin/profileHandler.js";
import { verifyToken } from "./apis/jwt.js";
import { verifyAdminPrivilges } from "./handlers/admin/verifyAdmin.js";
import { verifyStudentPriviliges } from "./handlers/student/verifyStudent.js";
import { verifyFacultyPriviliges } from "./handlers/faculty/verifyFaculty.js";

// # Import Middlewares and APIs

// # CONFIGURATIONS, MIDDLEWARES, INITIALIZATIONS

const app = express();
dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_ADDRESS,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: "Content-Type",
};

app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(cookieParser());
app.use(express.json());

// # APIS

// # HANDLERS

app.get("/", (req, res) => {
  if (getMaintenanceMode()) {
    res.status(503).send("Under Maintainance");
  } else {
    res.status(200).send("Hello World!");
  }
});

app.use("/auth", loginHandler);
app.use("/firstTime", firstTimeHandler);

app.use("/admin", verifyToken, verifyAdminPrivilges, mainAdmin);
app.use("/student", verifyToken, verifyStudentPriviliges, mainStudent);
app.use("/faculty", verifyToken, verifyFacultyPriviliges, mainFaculty);

// FOR CRON JOBS
app.get("/cron", (req, res) => {
  res.send("Hello Cron!");
});

const server = app.listen(5000);
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ADDRESS,
    methods: ["GET", "POST"],
  },
});
