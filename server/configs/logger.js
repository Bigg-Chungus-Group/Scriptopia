import winston from "winston";

// Function to format timestamp in IST
const getISTTimestamp = () => {
  const date = new Date();
  const ISTOffset = 330; // IST is UTC+5.5 in minutes
  const ISTTime = new Date(date.getTime() + ISTOffset * 60 * 1000);
  return ISTTime.toISOString();
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: getISTTimestamp }), // Add the timestamp to the log in IST
        winston.format.colorize(), // Add colors for console output (optional)
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "server.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: getISTTimestamp }), // Add the timestamp to the log in IST
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
  ],
  level: "debug",
});

logger.info("S100 - Server started");

export default logger;
