import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, refPath: 'entityType', required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

activitySchema.index({ workspaceId: 1, projectId: 1, createdAt: 1 });
activitySchema.index({ workspaceId: 1, projectId: 1, entityId: 1, createdAt: 1 });

const ActivityModel = mongoose.model('Activity', activitySchema);

export default ActivityModel;