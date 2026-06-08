import mongoose from "mongoose";

const projectMembersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    role: { type: String, enum: ['Lead', 'Developer', 'Reviewer', 'Tester', 'Guest'], default: 'Developer' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

projectMembersSchema.index({ userId: 1, projectId: 1 }, { unique: true });
const ProjectMembersModel = mongoose.model('ProjectMember', projectMembersSchema);

export default ProjectMembersModel;