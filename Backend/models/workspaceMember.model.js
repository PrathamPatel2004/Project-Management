import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: { type: String, enum: ['Admin', 'Project Manager', 'Member', 'Guest'], default: 'Member' }
}, { timestamps: true });

workspaceMemberSchema.index({ user: 1, workspace: 1 }, { unique: true });
const WorkspaceMemberModel = mongoose.model('WorkspaceMember', workspaceMemberSchema);

export default WorkspaceMemberModel;