import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compiler from "./apis/compiler.js";
import problemHandler from "./handlers/problemHandler.js";
import loginHandler from "./handlers/loginHandler.js";
const app = express();

import sql from "./configs/sql.js";
import logger from "./configs/logger.js";

// # MIDDLEWARES
app.use(cors());
app.use(express.json());
dotenv.config();

// # APIS
app.use("apis/compile", compiler);

// # HANDLERS
app.use("problems/", problemHandler);
app.use("/auth", loginHandler)

app.listen(5000);
