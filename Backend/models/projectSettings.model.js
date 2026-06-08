import mongoose from "mongoose";

const projectSettingsSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    defaultTaskView: { type: String, enum: ['Board','List','Gantt','Timeline'], default: 'Board' },
    enableTimeTracking: { type: Boolean, default: true },
    enableCostTracking: { type: Boolean, default: false },
    githubRepo: { type: String, default: "" },
    githubToken: { type: String, select: false },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const ProjectSettingsModel = mongoose.model('ProjectSettings', projectSettingsSchema);
export default ProjectSettingsModel;