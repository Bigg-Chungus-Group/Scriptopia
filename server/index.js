// # Import Modules

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cors from "cors";
import { instrument } from "@socket.io/admin-ui";
import bcrypt from "bcrypt"

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
import mainSocket from "./events/mainSocket.js";

// # Import Middlewares and APIs

// # CONFIGURATIONS, MIDDLEWARES, INITIALIZATIONS

const app = express();
dotenv.config();

const corsOptions = {
  origin: ["https://admin.socket.io", process.env.FRONTEND_ADDRESS, process.env.DEBUG_SERVER],
  credentials: true,
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
    origin: ["https://admin.socket.io", process.env.FRONTEND_ADDRESS, process.env.DEBUG_SERVER],
    credentials: true,
  },
});


instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: await bcrypt.hash("admin", 10)
  },
  mode: "development",
  namespaceName: "/socketadmin",
});

mainSocket();
