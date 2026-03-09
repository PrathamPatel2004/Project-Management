import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
    type: { type: String, enum: ['TASK', 'BUG', 'FEATURE', 'IMPROVEMENT', 'OTHER'], default: 'TASK' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    due_date: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;