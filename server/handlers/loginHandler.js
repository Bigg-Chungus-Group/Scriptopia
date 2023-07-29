import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
    console.log("CALLED")
    const { mid, password } = req.body;
    console.log(password)
    if (mid === "22204016" && password === "admin123") {
        res.status(200).json({ message: "Login Successful" });
    } else {
        res.status(401).json({ message: "Invalid Credentials" });
    }
})

export default router;