import mongoose from "mongoose";

const projectMembersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    role: { type: String, enum: ['Admin', 'Project Manager', 'Member', 'Guest'], default: 'Member' },
    joined_at: { type: Date, default: Date.now }
}, { timestamps: true });

const ProjectMembersModel = mongoose.model('ProjectMember', projectMembersSchema);

export default ProjectMembersModel;