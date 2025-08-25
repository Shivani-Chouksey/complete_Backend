import express from 'express'
import { CreateTask, DeleteTask, GetAllTask, UpdateTaskDetail } from '../controllers/task.controllers.js'

const router= express.Router();

router.post("/",CreateTask)
router.get("/",GetAllTask)
router.patch('/:id',UpdateTaskDetail)
router.delete("/:id",DeleteTask)



export default router