import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, 'Title Is Required'],
        trim:true
    },
    description: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'complete'],
        default:'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'high', 'medium'],
        default:'high'
    },


}, { timestamps: true })


export const TaskModel = mongoose.model("task", taskSchema)
