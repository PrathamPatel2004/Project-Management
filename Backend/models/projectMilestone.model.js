import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    due_date: { type: Date },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

const projectMilestoneModel = mongoose.model('ProjectMilestone', milestoneSchema);

export default projectMilestoneModel;