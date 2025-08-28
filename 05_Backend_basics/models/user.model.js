import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'username is required'],
        minlength: [6, 'Not Less than 6 character, got {VALUE}'],
        trim: true,
        unique: [true, 'username must be unique'],
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        require: [true, 'email is required'],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please use a valid email address"]
    },
    password: {
        type: String,
        require: true,
        select: true,
        minlength: [6, 'Password must be atleast 6 characters long '],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain uppercase,lowercase,number and special character']
    },
    otp: {
        type: Number
    },
    otp_expiry: {
        type: Date
    },
    // access_token: {
    //     type: String,

    // },
    refresh_token: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profile_image: {
        type: String,
        default: null
    }

}, { timestamps: true })


UserSchema.pre('save', async function (next) {
    const saltRound = 10
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, saltRound);
    next()
})

//custom method to check password correct or not
UserSchema.methods.CheckIsPasswordCorrect = async function (userPassword) {
    // console.log("inside CheckIsPasswordCorrect -->",userPassword,this.password)
    const isMatched = await bcrypt.compare(userPassword, this.password)
    // console.log("isMatched",isMatched);
    return isMatched
}



/*  custom method to generate JWT token*/
//ACCESS TOKEN
UserSchema.methods.generateAcessToken = function () {
    // console.log("inside generateAcessToken --> ",this._id,this.email,this.username,);
    // console.log("env variable -->", process.env.JWT_SECRET,process.env.JWT_ACCESS_TOKEN_EXPIRY)
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
        }
    );
};

//REFRESH TOKEN
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const UserModel = mongoose.model("users", UserSchema)