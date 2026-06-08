import mongoose from "mongoose";

const projectSprintsSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    goal: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Planning','Active','Completed'], default: 'Planning' },
    velocity: { type: Number, default: 0 },
}, { timestamps: true });

projectSprintsSchema.index({ projectId: 1 }, { unique: true });

const ProjectSprintsModel = mongoose.model('ProjectSprints', projectSprintsSchema);
export default ProjectSprintsModel;