import express from 'express'
import { LoginUser, RegisterUser, VerifyAccount } from '../controllers/user.controllers.js'
const router=express.Router()


router.get('/',(req,res)=>{
 res.send("user Route Wokring")
})

router.post("/register",RegisterUser);
router.post("/verify-account",VerifyAccount)
router.post("/login",LoginUser)

export default router