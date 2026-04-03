import mongoose from "mongoose";

const workspaceInvitationSchema = new mongoose.Schema({
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, enum: ["Admin", "Member", "Project Manager", "Guest"], default: "Member" },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, unique: true, default: "" },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ['Pending','Accepted','Expired'], default: 'Pending' },
    acceptedAt: { type: Date, default: null }
}, { timestamps: true });

workspaceInvitationSchema.index({ email: 1 });
workspaceInvitationSchema.index({ workspace: 1 });
workspaceInvitationSchema.index({ email: 1, workspace: 1 }, { unique: true });
workspaceInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index to automatically delete expired invitations

const WorkspaceInvitationModel = mongoose.model('WorkspaceInvitation', workspaceInvitationSchema);

export default WorkspaceInvitationModel;