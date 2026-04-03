import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    type: { type: String, enum: ['Task', 'Bug', 'Enhancement', 'Feature', 'Improvement', 'Other'], default: 'Task' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    due_date: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;