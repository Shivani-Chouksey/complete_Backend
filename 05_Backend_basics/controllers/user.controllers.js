
import { UserModel } from "../models/user.model.js"
import { generateFourDigitOTP } from "../utils/generateOtp.js"
import { Send_Mail } from "../utils/sendEmail.js"




export const RegisterUser = async (req, res) => {
    try {
        const userexist = await UserModel.findOne({ email: req.body.email })
        if (userexist) {
            return res.status(409).json({ message: "User Already Exist", Success: false })
        }

        // set expiry to 2 minutes from now
        const expiryTime = new Date(Date.now() + 2 * 60 * 1000);

        // generate random 4-digit OTP
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
        usermodel.otp_expiry = expiryTime
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
            return res.status(404).json({ Success: false, message: "Otp Not generated !" })
        }
        const is_otp_expiry = Date.now() > findExistingUser.otp_expiry
        if (is_otp_expiry) {
            findExistingUser.otp_expiry = null;
            findExistingUser.save();
            return res.status(500).json({ Success: false, message: "Otp is Expiry" })

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

export const ResendOtp = async (req, res) => {
    try {
        const findExistingUser = await UserModel.findOne({ email: req.body.email })
        if (!findExistingUser) {
            return res.status(404).json({ Success: false, message: "User Not Found For Generating Otp !" })
        }

        // set expiry to 2 minutes from now
        const expiryTime = new Date(Date.now() + 2 * 60 * 1000);

        // generate random 4-digit OTP
        const random_otp = generateFourDigitOTP()
        const otp_options = {
            user: req.body.email,
            subject: "OTP Verification",
            otp: random_otp,
            body: `<h1>otp verification - ${random_otp}</h2>` // can add email template also 
        }
        await Send_Mail(otp_options)

        findExistingUser.otp = random_otp
        findExistingUser.otp_expiry = expiryTime
        findExistingUser.save()

        return res.status(200).json({ Success: true, message: `Otp Send to Email ${req.body.email} ` })

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error" })
    }
}

export const LoginUser = async (req, res) => {
    try {

        const findExistingUser = await UserModel.findOne({ $or: [{ email: req.body.email }, { username: req.body.email }] })
        if (!findExistingUser) {
            return res.status(404).json({ Success: false, message: "User Not Found For Generating Otp !" })
        }

        if (!findExistingUser.isVerified) {
            return res.status(500).json({ Success: false, message: "Account is Not Verified ,Please Verified Your Acoount  !" })

        }
        const isPasswordMatch = await findExistingUser.CheckIsPasswordCorrect(req.body.password);
        if (!isPasswordMatch) {
            return res.status(500).json({ Success: false, message: "Invalid Credentail !" })
        }


        const access_token = await findExistingUser.generateAcessToken();
        const refresh_token = await findExistingUser.generateRefreshToken()
        await UserModel.findByIdAndUpdate(
            findExistingUser._id,
            { refresh_token: refresh_token },
            { new: true, validateModifiedOnly: true } // ✅ only validates changed fields
        );

        const loggedInUser = await UserModel.findById(findExistingUser._id).select(
            "-password "
        );

        const cookie_options = {
            httpOnly: false,          // ❌ JS can't access (prevents XSS)
            secure: false,            // ✅ only over HTTPS
            sameSite: "strict",      // prevents CSRF (use "lax" if mobile app)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
            path: "/api/auth/refresh-token", // only sent for refresh requests
        }
        return res.status(200).cookie("refresh-token", refresh_token, cookie_options).json({ Success: true, message: "Logged In Succeddfully", data: loggedInUser })

    } catch (error) {
        return res.status(500).json({ Success: false, message: "Internal Server Error" })

    }
}