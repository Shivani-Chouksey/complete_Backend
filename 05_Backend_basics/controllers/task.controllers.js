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

export const GetAllTask = async (req, res) => {
    try {
        const responseData = await TaskModel.find()
        res.json({ status: 200, Success: true, data: responseData })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false });
    }
}


export const UpdateTaskDetail=async(req,res)=>{
    try {
        console.log("params",req.params.id);
        const responseData=await TaskModel.findByIdAndUpdate({_id:req.params.id},req.body)
        console.log("responseData",responseData);
        
        res.json({status:200,Success:true,data:responseData})
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", Success: false ,error:error});
        
    }
}


export const DeleteTask=async(req,res)=>{
    try {
        await TaskModel.findByIdAndDelete({_id:req.params.id})
        res.json({status:200,Success:true,message:"Deleted !"})
    } catch (error) {
          res.status(500).json({ message: "Internal Server Error", Success: false ,error:error});
        
    }
}