
import  { UserModel } from "../models/user.model.js"
import { generateFourDigitOTP } from "../utils/generateOtp.js"
import { Send_Mail } from "../utils/sendEmail.js"


export const RegisterUser = async (req, res) => {
    try {
        const userexist = await UserModel.findOne({ email: req.body.email })
        if (userexist) {
            return res.status(409).json({ message: "User Already Exist", Success: false })
        }

        const random_otp = generateFourDigitOTP()
        const otp_options = {
            user: req.body.email,
            subject: "OTP Verification",
            otp: random_otp,
            body: `<h1>otp verification - ${random_otp}</h2>` // can add email template also 
        }
        await Send_Mail(otp_options)
        const usermodel = new UserModel(req.body)
        usermodel.otp = random_otp
        await usermodel.save();
        return res.status(201).json({ message: "Register Successfully", Success: true })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Internal Server Error ", Success: false, error: error.message })
    }
}



export const VerifyAccount = async (req, res) => {
    try {
        const findExistingUser = await UserModel.findOne({ otp: req.body.otp })
        if (!findExistingUser) {
            return res.status(404).json({ Success: true, message: "Otp Not generated !" })
        }

        if (findExistingUser) {
            findExistingUser.otp = '';
            findExistingUser.isVerified = true;
            findExistingUser.save()
        }
        return res.status(200).json({ Success: true, message: "Account Verified !" })
    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error" })
    }
}


export const LoginUser = async (req, res) => {
    try {

    } catch (error) {
    }
}