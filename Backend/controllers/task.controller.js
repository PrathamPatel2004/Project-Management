import TaskModel from "../models/task.model.js";
import ProjectModel from "../models/project.model.js";

export const createProjectTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params; 
        const { stageId, title, description, type, priority, status, assigneeId, labels, checklist, estimatedHours, start_date, due_date } = req.body;

        const project = await ProjectModel.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        const task = await TaskModel.create({
            projectId,
            stageId,
            title,
            description,
            type,
            priority,
            status,
            assigneeId,
            reporterId: userId,
            labels,
            checklist,
            estimatedHours,
            start_date,
            due_date,
        });

        const populatedTask = await TaskModel.findById(task._id)
            .populate({
                path: "assigneeId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate({
                path: "reporterId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate("stageId", "name wipLimit");
      
        return res.status(201).json({ success: true, message: "Task created successfully", task: populatedTask });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await TaskModel.find({ projectId, deletedAt: null })
            .populate({
                path: "assigneeId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate({
                path: "reporterId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate("stageId", "name wipLimit")
            .sort({
                position: 1,
                createdAt: -1,
            });
        return res.status(200).json({ success: true, tasks });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params

        const task = await TaskModel.findById(taskId)
            .populate({
                path: "assigneeId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate("stageId", "name description order color");

        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        return res.status(200).json({ success: true, task });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        const task = await TaskModel.findByIdAndUpdate(taskId, { $set: req.body }, { new: true, runValidators: true })
            .populate({
                path: "assigneeId",
                select: "role userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                }],
            })
            .populate("stageId", "name description order color");

        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        return res.status(200).json({ success: true, message: "Task updated successfully", task });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await TaskModel.findByIdAndUpdate(taskId, { deletedAt: new Date() }, { new: true });
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    
        return res.status(200).json({ success: true, message: "Task deleted successfully", taskId });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};