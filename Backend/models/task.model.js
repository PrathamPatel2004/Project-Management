import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectStage', required: true },
    parentTaskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null },
    task_key: { type: String, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: '', trim: true },
    archived: { type: Boolean, default: false },
    attachments: [{ name: String, url: String, size: Number, mimeType: String }],
    labels: [{ type: String, trim: true }],
    checklist: [{
        title: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
    }],
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectSprints", default: null },
    type: { type: String, enum: ["Task", "Bug", "Feature", "Enhancement", "Improvement", "Epic", "Story", "Other"], default: "Task" },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ["Backlog", "To Do", "In Progress", "Review", "Testing", "Blocked", "Done", "Cancelled"], default: "To Do" },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember', required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectMember", required: true },    
    estimatedHours: { type: Number, default: 0, min: 0 },
    actualHours: { type: Number, default: 0, min: 0 },
    due_date: { type: Date, default: null },
    start_date: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

taskSchema.index({ projectId: 1, stageId: 1 });
taskSchema.index({ projectId: 1, assigneeId: 1 });
taskSchema.index({ projectId: 1, priority: 1 });
taskSchema.index({ projectId: 1, due_date: 1 });
taskSchema.index({ projectId: 1, task_key: 1 });

taskSchema.pre("save", async function () {
    if (this.task_key) return

    const count = await mongoose.model("Task").countDocuments({ projectId: this.projectId });
    this.task_key = `TASK-${count + 1}`;
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;