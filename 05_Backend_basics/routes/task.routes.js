import express from 'express'
import { CreateTask, DeleteTask, GetAllTask, UpdateTaskDetail } from '../controllers/task.controllers.js'
import { ValidateTask } from '../middleware/validations/validateTask.middleware.js';

const router= express.Router();

router.post("/",ValidateTask,CreateTask)
router.get("/",GetAllTask)
router.patch('/:id',ValidateTask,UpdateTaskDetail)
router.delete("/:id",DeleteTask)



export default router