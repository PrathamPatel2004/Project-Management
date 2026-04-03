import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    role: { type: String, enum: ['Owner', 'Admin', 'Project Manager', 'Member', 'Guest'], default: 'Member' },
    status: { type: String, enum: ['Active','Pending','Suspended'], default: 'Active' },
    joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

workspaceMemberSchema.index({ user: 1, workspace: 1 }, { unique: true });
workspaceMemberSchema.index({ workspace: 1 });
const WorkspaceMemberModel = mongoose.model('WorkspaceMember', workspaceMemberSchema);

export default WorkspaceMemberModel;