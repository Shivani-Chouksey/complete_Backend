import express from 'express'
import { LoginUser, RegisterUser, ResendOtp, VerifyAccount } from '../controllers/user.controllers.js'
import { ValidateUserReq } from '../middleware/validations/validateUserReq.middleware.js'
const router=express.Router()


router.get('/',(req,res)=>{
 res.send("user Route Wokring")
})

router.post("/register",ValidateUserReq,RegisterUser);
router.post("/verify-account",VerifyAccount)
router.post("/resend-otp",ResendOtp)
router.post("/login",LoginUser)

export default router