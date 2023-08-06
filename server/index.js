import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compiler from "./apis/compiler.js";
import problemHandler from "./handlers/problemHandler.js";
import loginHandler from "./handlers/loginHandler.js";
import profileHandler from "./handlers/profileHandler.js";
import cookieParser from "cookie-parser";
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// # MIDDLEWARES
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

// # APIS
app.use("apis/compile", compiler);

// # HANDLERS
app.use("/problem/", problemHandler);
app.use("/auth", loginHandler);
app.use("/profile", profileHandler);

app.listen(5000);
