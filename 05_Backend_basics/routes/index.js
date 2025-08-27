import express from 'express'
import TaskRoutes from './task.routes.js'
import UserRoutes from './user.routes.js'
const router=express.Router()

router.use('/task',TaskRoutes);
router.use('/user',UserRoutes)

export default router
