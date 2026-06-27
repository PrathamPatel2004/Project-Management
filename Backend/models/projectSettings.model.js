import mongoose from "mongoose";

const projectSettingsSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    defaultTaskView: { type: String, enum: ['Board','List','Gantt','Timeline', 'Calendar'], default: 'Board' },
    enableTimeTracking: { type: Boolean, default: true },
    enableCostTracking: { type: Boolean, default: false },
    enableSprints: { type: Boolean, default: false },
    enableSubTasks: { type: Boolean, default: true },
    enableFileAttachments: { type: Boolean, default: true },
    githubRepo: { type: String, default: "", trim: true },
    githubToken: { type: String, select: false },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const ProjectSettingsModel = mongoose.model('ProjectSettings', projectSettingsSchema);
export default ProjectSettingsModel;
// const projectSettingsSchema = new mongoose.Schema(
//     {
        

//         // ── Notifications ─────────────────────────────────────────────────────
//         notifyOnTaskCreate: {
//             type: Boolean,
//             default: true,
//         },
//         notifyOnTaskUpdate: {
//             type: Boolean,
//             default: false,
//         },
//         notifyOnComment: {
//             type: Boolean,
//             default: true,
//         },
// );
