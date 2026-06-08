import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    project_key: { type: String, uppercase: true, required: true, trim: true },
    description: { type: String, default: "" },
    projectIcon: { type: String, default: "" },
    flowType: { type: String, enum: ['Agile','Kanban','Waterfall','Custom'], default: 'Kanban' },
    stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage" }],
    currentStage: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectStage" },
    sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectSprint" }],
    currentSprint: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectSprint" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    status: { type: String, enum: [ "Active", "On Hold", "Completed", "Cancelled", "Archived" ], default: "Active" },
    health: { type: String, enum: ["Healthy", "At Risk", "Critical"], default: "Healthy" },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    projectMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectMember" }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    labels: [{ type: String }],
    progress: { type: Number, default: 0 },
    budget: { type: Number, default: 0 },
    spent_budget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    deletedAt: { type: Date, default: null },
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.index({ workspace: 1, project_key: 1 }, { unique: true });
projectSchema.index({ workspace: 1, status: 1 });

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;