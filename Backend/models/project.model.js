// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//     name: { type: String, required: true, trim: true },
//     project_key: { type: String, uppercase: true, trim: true },
//     description: { type: String, default: '' },
//     priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
//     status: { type: String, enum: ['Idea', 'Planning', 'Approved', 'In Progress', 'On Hold', 'Blocked', 'Testing', 'Deploying', 'Completed', 'Cancelled', 'Archived'], default: 'Idea' },
//     health: { type: String, enum: ['Healthy', 'At Risk', 'Critical'], default: 'Healthy' },
//     start_date: { type: Date, default: null },
//     end_date: { type: Date, default: null },
//     team_lead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }],
//     workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
//     labels: [{ type: String, trim: true }],
//     progress: { type: Number, default: 0, min: 0, max: 100 },
//     milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMilestone' }],
//     budget: { type: Number, default: 0 },
//     spent_budget: { type: Number, default: 0 },
// }, { timestamps: true });

// projectSchema.index({ workspace: 1 });
// const ProjectModel = mongoose.model('Project', projectSchema);

// export default ProjectModel;

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    project_key: { type: String, uppercase: true, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    status: { type: String, enum: [ "Idea", "Planning", "Approved", "In Progress", "On Hold", "Blocked", "Testing", "Deploying", "Completed", "Cancelled", "Archived" ], default: "Idea" },
    health: { type: String, enum: ["Healthy", "At Risk", "Critical"], default: "Healthy" },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    team_lead: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectMember" }],
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    labels: [{ type: String }],
    progress: { type: Number, default: 0 },
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProjectMilestone" }],
    budget: { type: Number, default: 0 },
    spent_budget: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
}, { timestamps: true });

projectSchema.index({ workspace: 1, project_key: 1 }, { unique: true });
projectSchema.index({ workspace: 1, status: 1 });

export default mongoose.model("Project", projectSchema);