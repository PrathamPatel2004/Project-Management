import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    settings: { type: Object, default: {} },
    image_url: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const WorkspaceModel = mongoose.model('Workspace', workspaceSchema);

export default WorkspaceModel;