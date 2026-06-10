import ProjectModel from "../models/project.model.js";
import ProjectStagesModel from "../models/projectStages.model.js";
import ProjectSettingsModel from "../models/projectSettings.model.js";
import ProjectSprintsModel from "../models/projectSprints.model.js";
import ProjectMembersModel from "../models/projectMembers.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";
import ActivityModel from "../models/activity.model.js";
import { generateProjectKey } from "../services/project.service.js";
import { createActivity } from "../services/activity.service.js";

export const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, projectIcon, priority, status, flowType, workspaceId, end_date, members = [], project_stages = [] } = req.body;

        if (!workspaceId) return res.status(400).json({ success: false, message: "Workspace ID is required" });
        if (!name?.trim()) return res.status(400).json({ success: false, message: "Project name is required" });

        const membership = await WorkspaceMemberModel.findOne({ user: userId, workspace: workspaceId });
        if (!membership) return res.status(403).json({ success: false, message: "Not a workspace member" });

        const existingProject = await ProjectModel.findOne({ workspace: workspaceId, name: name.trim(), deletedAt: null });
        if (existingProject) return res.status(400).json({ success: false, message: "Project already exists" });

        const leadMembers = members.filter(
            (member) => member.role === "Lead"
        );

        if (leadMembers.length !== 1) return res.status(400).json({ success: false, message: "Exactly one project lead is required" });

        const memberIds = members.map((member) => member.userId);
        const workspaceMembers = await WorkspaceMemberModel.find({ workspace: workspaceId, user: { $in: memberIds } }).select("user");
        const workspaceMemberIds = workspaceMembers.map((member) => member.user.toString());

        const invalidMembers = memberIds.filter((id) =>
            !workspaceMemberIds.includes(id.toString())
        );

        if (invalidMembers.length > 0) return res.status(400).json({ success: false, message: "All project members must belong to the workspace" });

        const projectKey = await generateProjectKey(name);
        if (end_date && new Date(end_date) < new Date()) return res.status(400).json({ message: "End date cannot be in the past" });

        const project = await ProjectModel.create({
            name,
            description,
            projectIcon,
            priority,
            status,
            flowType,
            created_by: userId,
            workspace: workspaceId,
            end_date,
            project_key: projectKey
        });

        const projectMembersDocs = members.map(
            (member) => ({
                userId: member.userId,
                projectId: project._id,
                role: member.role,
                addedBy: userId
            })
        );
        
        const newMembers = await ProjectMembersModel.insertMany(projectMembersDocs);
        project.projectMembers = newMembers.map(m => m._id);

        if (flowType === "Agile" || flowType === "Kanban") {
            const defaultStages = await ProjectStagesModel.insertMany([
                { projectId: project._id, name: "Todo", order: 1, isDefault: true },
                { projectId: project._id, name: "In Progress", order: 2 },
                { projectId: project._id, name: "Review", order: 3 },
                { projectId: project._id, name: "Done", order: 4, isDone: true }
            ]);

            project.stages = defaultStages.map(s => s._id);
            project.currentStage = defaultStages[0]._id;
        } else if (flowType === "Waterfall") {
            const defaultStages = await ProjectStagesModel.insertMany([
                { projectId: project._id, name: "Requirements", order: 1, isDefault: true },
                { projectId: project._id, name: "Design", order: 2 },
                { projectId: project._id, name: "Development", order: 3 },
                { projectId: project._id, name: "Testing", order: 4 },
                { projectId: project._id, name: "Deployment", order: 5, isDone: true }
            ]);

            project.stages = defaultStages.map(s => s._id);
            project.currentStage = defaultStages[0]._id;
        } else {
            if (!project_stages.length) return res.status(400).json({ success: false, message: "Custom flow requires at least one stage" });
            
            const stageDocs = project_stages.map((stage, index) => ({
                projectId: project._id,
                name: stage.name,
                order: index + 1,
                isDefault: index === 0,
                isDone: index === project_stages.length - 1
            }));
            await ProjectStagesModel.insertMany(stageDocs);

            project.stages = stageDocs.map(s => s._id);
            project.currentStage = stageDocs[0]._id;
        }

        await ProjectSettingsModel.create({ projectId: project._id });

        if (flowType === "Agile") {
            const sprint = await ProjectSprintsModel.create({
                projectId: project._id,
                name: "Sprint 1",
                goal: "Initial Sprint",
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            });

            project.sprints.push(sprint._id);
            project.currentSprint = sprint._id;
        }

        await project.save();

        const activity = await createActivity({ userId, workspaceId, action: "PROJECT_CREATED", entityType: "Project", entityId: project._id, ip: req.ip, metadata: { projectName: project.name } });
        activity.projectId = project._id;

        activity.save();

        return res.status(201).json({ success: true, message: "Project created successfully", project });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        if (!workspaceId) return res.status(400).json({ message: "Workspace ID is required" });
        const projects = await ProjectModel.find({ workspace: workspaceId, deletedAt: null })
            .populate({
                path: "projectMembers",
                populate: {
                    path: "userId",
                    select: "name email profileImage"
                }
            })
            .populate(
                "created_by",
                "name email profileImage"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await ProjectModel.findById(projectId)
            .populate({
                path: "projectMembers",
                populate: {
                    path: "userId",
                    select: "name email profileImage"
                }
            })
            .populate("created_by", "name email profileImage")
            .populate("stages")
            .populate("sprints");

        if (!project) return res.status(404).json({ success: false, message: "Project not found" });
        
        return res.status(200).json({ success: true, project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};