import ProjectModel from "../models/project.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";

export const generateProjectKey = async (name, workspaceId) => {
    let base = name.replace(/\s+/g, "").substring(0, 5).toUpperCase();
    let key = base;
    let counter = 1;

    while (
        await ProjectModel.findOne({ project_key: key, workspace: workspaceId })
    ) {
        key = `${base}${counter++}`;
    }
    return key;
};

export const createProjectService = async (data, userId) => {
    const {
        name,
        workspaceId,
        team_lead,
        start_date,
        end_date,
    } = data;

    const member = await WorkspaceMemberModel.findOne({
        user: userId,
        workspace: workspaceId,
    });

    if (!member) throw new Error("Not a workspace member");
    const teamLeadMember = await WorkspaceMemberModel.findOne({
        user: team_lead,
        workspace: workspaceId,
    });

    if (!teamLeadMember) {
        throw new Error("Invalid team lead");
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        throw new Error("Invalid date range");
    }

    const exists = await ProjectModel.findOne({
        name,
        workspace: workspaceId,
    });

    if (exists) throw new Error("Project already exists");

    const project_key = await generateProjectKey(name, workspaceId);
    const project = await ProjectModel.create({
        ...data,
        project_key,
        created_by: userId,
        workspace: workspaceId,
    });

    return project;
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