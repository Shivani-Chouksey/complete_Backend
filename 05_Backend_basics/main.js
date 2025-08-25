import express from 'express';
import 'dotenv/config'
import connectDB from './config/dbConnection.js';
import TaskRoutes from './routes/task.routes.js'
const app = express()
app.use(express.json())

// all routes
app.use("/api/v1/task",TaskRoutes)

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is Running on Port :${process.env.PORT}`);

        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    })




