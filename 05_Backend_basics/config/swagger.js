import swaggerDoc from 'swagger-jsdoc'
import swaggerUi, { serve } from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Basic CRUD API',
            version: '1.0.0',
            description: 'A simple Express API with Swagger documentation',
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1'
            }
        ]
    },
    apis: ['./routes/*.js'], // Path to your API routes
}

export const specs = swaggerDoc(options);
