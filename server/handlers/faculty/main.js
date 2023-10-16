import express from "express";
const router = express.Router();
import certificates from "./certificatesHandler.js";
import enrollment from "./enrollmentHandler.js";
import profile from "./profileHandler.js";
import dashboard from "./dashboardHandler.js";

router.use("/certificates", certificates);
router.use("/enrollments", enrollment);
router.use("/profile", profile);
router.use("/dashboard", dashboard);


export default router;
