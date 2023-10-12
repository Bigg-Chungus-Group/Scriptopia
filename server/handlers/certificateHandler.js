import express from "express";
const router = express.Router();
import { certificationsDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";

router.post("/get", async (req, res) => {
  const { id } = req.body;
  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(certificate);
  } catch (error) {
    logger.error({
      code: "STU-CHH-102",
      message: "Certificate with ID " + id + "not found",
      mid: req.user.mid,
      err: error.message,
    });
    res.status(400).send("Certificate not found");
  }
});


router.post("/download", async (req, res) => {
  const { id } = req.body;
  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(400).send("Certificate not found");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const certificatePath = `${__dirname}/../../../public/certificates/${certificate._id}`;

    res.download(certificatePath, certificate.certificateName);
  } catch (error) {
    logger.error({
      code: "STU-CHH-103",
      message: "Certificate with ID " + id + "not found",
      mid: req.user.mid,
      err: error.message,
    });
    res.status(400).send("Certificate not found");
  }
});


export default router;
