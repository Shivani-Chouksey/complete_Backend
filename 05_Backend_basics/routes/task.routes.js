import express from 'express'
import { CreateTask, DeleteTask, GetAllTask, UpdateTaskDetail } from '../controllers/task.controllers.js'
import { ValidateTask } from '../middleware/validations/validateTask.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *              
 *     responses:
 *       201:
 *         description: Task created
 */

router.post("/", ValidateTask, CreateTask)

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: A list of tasks
 */
router.get("/", GetAllTask)
router.patch('/:id', ValidateTask, UpdateTaskDetail)
router.delete("/:id", DeleteTask)



export default router