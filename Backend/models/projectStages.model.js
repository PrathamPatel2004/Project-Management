import mongoose from "mongoose";

const projectStagesSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    color: { type: String, default: '#6366f1' }, 
    isDefault: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },
    wipLimit: { type: Number, default: null }
}, { timestamps: true });

projectStagesSchema.index({ projectId:1, name: 1, order: 1 }, { unique: true });

const ProjectStagesModel = mongoose.model('ProjectStage', projectStagesSchema);
export default ProjectStagesModel;