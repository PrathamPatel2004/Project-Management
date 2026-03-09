import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Idea', 'Planning', 'Approved', 'In Progress', 'On Hold', 'Blocked', 'Testing', 'Deploying', 'Completed', 'Cancelled', 'Archived', 'At Risk'], default: 'Idea' },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    team_lead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ProjectModel = mongoose.model('Project', projectSchema);

export default ProjectModel;