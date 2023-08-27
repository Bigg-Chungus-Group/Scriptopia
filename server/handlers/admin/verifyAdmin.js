import jwt from "jsonwebtoken";
import logger from "../../configs/logger.js";

export const verifyAdminPrivilges = (req, res, next) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error({ code: "VA", message: token });
      res.status(401).json({ error: "Illegal Admin Access Found" });
      return;
    }

    if (decoded.role !== "A") {
      logger.error({ code: "VA", message: token });
      res.status(401).json({ error: "Illegal Admin Access Found" });
      return;
    }

    req.user = decoded;
    next();
  });
};
