import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connected !! DB Host : ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.log("MONGO_DB connection FAILED:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
