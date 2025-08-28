import express from 'express';
import 'dotenv/config'
import connectDB from './config/dbConnection.js';
import All_routes from './routes/index.js'
import { specs } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

// Entry for all routes
app.use("/api/v1", All_routes)
//swagger API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is Running on Port :${process.env.PORT}`);

        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    })




