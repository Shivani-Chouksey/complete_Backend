import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hospital Management API is working!");
});

export default router;
