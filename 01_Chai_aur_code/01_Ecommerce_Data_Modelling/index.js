import express from "express";
import "dotenv/config";
import EcommerceRoute from "./routes/route.js";
const app = express();

app.use("/api/v1/e-commerce", EcommerceRoute);
app.get("/", (req, res) => {
  res.send("Hello from API Server!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
