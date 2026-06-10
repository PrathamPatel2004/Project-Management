import ActivityModel from "../models/activity.model.js";

export const createActivity = ({ userId, workspaceId, action, entityType, entityId, ip, metadata }) => {
    return ActivityModel.create({ userId, workspaceId, action, entityType, entityId, ip, metadata });
}

export const getActivityMessage = (activity) => {
    switch (activity.action) {
        case "WORKSPACE_CREATED":
            return `Created workspace "${activity.metadata?.workspaceName}"`;

        case "WORKSPACE_UPDATED":
            return `Updated workspace`;

        case "PROJECT_CREATED":
            return `Created project "${activity.metadata?.projectName}"`;

        case "PROJECT_UPDATED":
            return `Updated project "${activity.metadata?.projectName}"`;

        case "PROJECT_DELETED":
            return `Deleted project "${activity.metadata?.projectName}"`;

        case "MEMBERS_INVITED":
            return `Invited ${activity.metadata?.emails?.length || 0} members`;

        case "MEMBERS_REMOVED":
            return `Removed ${activity.metadata?.emails?.length || 0} members`;

        case "ROLE_CHANGED":
            return `Changed role of ${activity.metadata?.email}`;

        case "TASK_CREATED":
            return `Created task "${activity.metadata?.taskName}"`;

        case "TASK_UPDATED":
            return `Updated task "${activity.metadata?.taskName}"`;

        case "TASK_COMPLETED":
            return `Completed task "${activity.metadata?.taskName}"`;

        case "TASK_DELETED":
            return `Deleted task "${activity.metadata?.taskName}"`;

        default:
            return activity.action
                ?.replaceAll("_", " ")
                ?.toLowerCase()
                ?.replace(/\b\w/g, c => c.toUpperCase());
    }
};