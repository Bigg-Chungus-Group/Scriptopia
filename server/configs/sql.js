import mysql from "mysql2";
import logger from "./logger.js";

const db = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});

db.connect((err) => {
  if (err) {
    logger.error("SQL200 - Error connecting to MySQL: " + err.stack);
  } else {
    logger.info("SQL100 - Connected to MySQL");
  }
});

export default db;