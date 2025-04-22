import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

/* Connection with Database */
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in Express Server:", error.message);
      throw error; // Rethrow the error to be caught in the catch block
    });
    // listen the server only if the database connection is successful
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit the process with failure
  });
