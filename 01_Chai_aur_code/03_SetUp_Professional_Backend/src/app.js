import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routes/user.routes.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
};

/* Middile ware */
app.use(cors(corsOptions));
/* handle data comes from body data */
app.use(express.json({ limit: "16kb" }));
/* handle data comes from Url Data */
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
/* Save file folder data */
app.use(express.static("public"));
/* handle cookies */
app.use(cookieParser());

/* Routes Declartion*/
app.use("/api/v1/user", UserRoutes);

export { app };
