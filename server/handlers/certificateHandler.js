import express from "express";
const router = express.Router();
import { certificationsDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";
import { app } from "../firebase.js";
import { verifyToken } from "../apis/jwt.js"

const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

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
  console.log("DOWNLOAD");

  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(404).send("Certificate not found");
    }

    if (certificate.uploadType === "url") {
      return res.status(400).send("Invalid certificate type for download");
    }

    const certificatePath = certificate.certificateURL;
    const file = fbstorage.file(certificatePath);
    const fileExists = await file.exists();
    console.log(fileExists);

    console.log(certificatePath);
    if (!fileExists) {
      console.log("FILE NOT FOUND");
      return res
        .status(404)
        .send("Certificate file not found in Firebase Storage");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate.certificateName}.${certificate.ext}"`
    );
    res.setHeader("Content-Type", "application/pdf"); // Set the appropriate content type

    file
      .createReadStream()
      .on("error", (err) => {
        console.error("Error streaming the file:", err);
        res.status(500).send("Error streaming the file");
      })
      .on("end", () => {
        console.log("File streaming complete.");
      })
      .pipe(res);
  } catch (error) {
    console.log(error);
    logger.error({
      code: "STU-CHH-103",
      message: `Error while trying to download certificate with ID ${id}`,
      mid: req.user.mid,
      err: error.message,
    });
    res.status(500).send("Internal server error");
  }
});

export default router;
