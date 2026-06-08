import mongoose from "mongoose";

const workspaceSubscriptionSchema = new mongoose.Schema({
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    plan: { type: String, enum: ['free','pro','enterprise'], default: 'free' },
    seats: { type: Number, default: 5 },
    storageLimit: { type: Number, default: 5368709120 },
    storageUsed: { type: Number, default: 0 },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    status: { type: String, enum: ['active','trialing','past_due','canceled','incomplete'], default: 'active' },
    cancelAtPeriodEnd: { type: Boolean, default: false },
    trialEndsAt: Date,
    currentPeriodEnd: Date
}, { timestamps: true });

workspaceSubscriptionSchema.index({ workspaceId: 1 }, { unique: true });

const WorkspaceSubscriptionModel = mongoose.model('WorkspaceSubscription', workspaceSubscriptionSchema);

export default WorkspaceSubscriptionModel;