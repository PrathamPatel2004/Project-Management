import ActivityModel from "../models/activity.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";

export const getProjectActivity = async (req, res) => {
    try {
        const { workspaceId, projectId } = req.params; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            ActivityModel.find({ projectId, workspaceId })
                .populate("userId", "name email profilePicture")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ActivityModel.countDocuments({ projectId, workspaceId })
        ]);

        return res.status(200).json({
            success: true,
            message: "Project activities fetched successfully",
            data: {
                activities,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error("Get Project Activity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project activities",
            error: error.message
        });
    }
};

export const getWorkspaceActivity = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            ActivityModel.find({ workspaceId })
                .populate("userId", "name email profilePicture")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ActivityModel.countDocuments({ workspaceId })
        ]);

        const userIds = activities.map(activity => activity.userId?._id).filter(Boolean);
        const workspaceMembers = await WorkspaceMemberModel.find({ workspace: workspaceId, user: { $in: userIds } }).select("user role").lean();

        const roleMap = new Map(workspaceMembers.map(member => [member.user.toString(), member.role]));
        const activitiesWithRoles = activities.map(activity => ({ ...activity, userRole: roleMap.get(activity.userId?._id?.toString()) || null }));

        return res.status(200).json({
            success: true,
            message: "Workspace activities fetched successfully",
            data: {
                activities: activitiesWithRoles,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error("Get Workspace Activity Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch workspace activities",
            error: error.message
        });
    }
};