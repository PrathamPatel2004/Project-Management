import mongoose from "mongoose";

const projectStagesSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    description: { type: String, default: "", maxlength: 300 },
    order: { type: Number, required: true, min: 1 },
    color: { type: String, default: '#6366f1' }, 
    isDefault: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },
    wipLimit: { type: Number, default: null, min: 1 } // Max tasks allowed in this stage at once (Kanban WIP limit). null = unlimited
}, { timestamps: true });

projectStagesSchema.index({ projectId:1, name: 1 }, { unique: true }); // unique stage name for project
projectStagesSchema.index({ projectId: 1, order: 1 });

const ProjectStagesModel = mongoose.model('ProjectStage', projectStagesSchema);
export default ProjectStagesModel;