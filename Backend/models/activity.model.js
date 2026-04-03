import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entityType', required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// projectSchema.index({ workspace: 1 });
// projectSchema.index({ workspace: 1, status: 1 });
// projectSchema.index({ workspace: 1, archived: 1 });

const ActivityModel = mongoose.model('Activity', activitySchema);

export default ActivityModel;