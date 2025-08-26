import mongoose from "mongoose";
import { TaskModel } from "../models/task.model.js";


export const CreateTask = async (req, res) => {
    try {
        const reqData = req.body
        console.log(req, reqData);
        await TaskModel.create(reqData);
        res.json({ status: 201, message: "Task Created Successfully ", Success: true })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false });
    }
}


//with pagination 
export const GetAllTask = async (req, res) => {
    try {
        const page = parseInt(req.query.pageNumber) || 1
        const pageLimit = parseInt(req.query.limit) || 5
        const skipValue = (page - 1) * pageLimit


        // Build filter only if query params are present
        const filterQuery = {}
        if (req.query.status) {
            filterQuery.status = req.query.status
        } { }
        if (req.query.priority) {
            filterQuery.priority = req.query.priority
        }


        const responseData = await TaskModel.find(filterQuery).skip(skipValue).limit(pageLimit).sort()
        const documentsCount = await TaskModel.countDocuments(filterQuery)
        const pageInfoObject = {
            page,
            limit: pageLimit,
            totalRecord: documentsCount,
            totalPages: Math.ceil(documentsCount / pageLimit)
        }
        res.json({ status: 200, Success: true, data: responseData, pagination_Info: pageInfoObject })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false });
    }
}


export const UpdateTaskDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ Success: false, message: "Invalid Task ID format " })
        }
        const existingTask = await TaskModel.findById(id)
        if (!existingTask) {
            return res.status(404).json({ message: "Task Not Found", Success: false })
        }
        const responseData = await TaskModel.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        res.json({ status: 200, Success: true, data: responseData })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false });

    }
}


export const DeleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // validate objectId 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Task ID format', Success: false })
        }

        //check task existance
        const existingTask = await TaskModel.findById(id);
        if (!existingTask) {
            return res.status(404).json({ message: "Task not Found", Success: false })
        }

        await TaskModel.findByIdAndDelete(id)
        res.json({ status: 200, Success: true, message: "Deleted !" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false, error: error.message });

    }
}