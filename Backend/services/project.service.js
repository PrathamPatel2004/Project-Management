import ProjectModel from "../models/project.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";

export const generateProjectKey = (name = "") => {
    const words = name.trim().split(/[\s_-]+/).filter(Boolean);

    if (words.length > 1) {
        return words.map(word => word[0]).join("").toUpperCase().slice(0, 4);
    }

    return words[0]?.substring(0, 4).toUpperCase() || "";
};

export const fetchProjectsService = async (workspaceId, query) => {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
        ProjectModel.find({ workspace: workspaceId, isDeleted: false })
            .populate("team_lead", "name email profileImage")
            .skip(skip)
            .limit(Number(limit))
            .lean(),

        ProjectModel.countDocuments({ workspace: workspaceId }),
    ]);

    return {
        projects,
        pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
        },
    };
};