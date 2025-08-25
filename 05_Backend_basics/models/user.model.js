import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'username is required'],
        minlength: [6, 'Not Less than 6 character, got {VALUE}'],
        trim:true
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        require: [true, 'email is required'],
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please use a valid email address"]
    },
    password: {
        type: String,
        require: true,
        select:false,
        minlength:[6,'Password must be atleast 6 characters long '],
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'Password must contain uppercase,lowercase,number and special character']
    },
    otp: {
        type: Number
    },
    otp_expiry:{
        type:Date
    },
    access_token: {
        type: String,

    },
    refresh_token: {
        type: String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default :'active'
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
}, { timestamps: true })

export default UserModel = mongoose.model("users", UserSchema)