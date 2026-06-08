import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

workspaceSchema.index({ owner: 1 });
const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

export default WorkspaceModel;