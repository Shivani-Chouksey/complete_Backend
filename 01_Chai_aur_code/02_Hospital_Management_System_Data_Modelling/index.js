import express from "express";
import "dotenv/config";
import HospitalManagementRoute from "./routes/route.js";
const app = express();

app.use("/api/v1/hospital-management", HospitalManagementRoute);
app.get("/", (req, res) => {
  res.send("Hello from hospital-management API Server!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
