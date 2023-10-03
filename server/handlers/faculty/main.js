import express from "express";
const router = express.Router();
import certificates from "./certificatesHandler.js";
import enrollment from "./enrollmentHandler.js";

router.use("/certificates", certificates);
router.use("/enrollments", enrollment);

export default router;
