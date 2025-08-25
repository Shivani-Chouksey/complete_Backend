import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    tittle: {
        type: String,
        require: [true, 'Tittle Is Required']
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
    },


}, { timestamps: true })


export const TaskModel = mongoose.model("task", taskSchema)
