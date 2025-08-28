import express from 'express'
import { LoginUser, RefreshToken, RegisterUser, ResendOtp, UploadProfileImage, VerifyAccount } from '../controllers/user.controllers.js'
import { ValidateUserReq } from '../middleware/validations/validateUserReq.middleware.js'
import { AuthenticateUserMiddleware } from '../middleware/authenticate-user.js'
import { upload } from '../middleware/multer.middleware.js'
import { limiter } from '../utils/rateLimiter.js'
const router=express.Router()

router.post("/register",ValidateUserReq,RegisterUser);
router.post("/verify-account",VerifyAccount)
router.post("/resend-otp",ResendOtp)
router.post("/login",limiter,LoginUser)
router.get("/refresh-token",RefreshToken)
router.post("/upload-profile",AuthenticateUserMiddleware,upload.single('upload_profile'),UploadProfileImage)

export default router