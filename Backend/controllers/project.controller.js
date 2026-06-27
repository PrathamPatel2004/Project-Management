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
        const { name, description, projectIcon, priority, status, flowType, workspaceId, end_date, budget, currency, labels = [], members = [], project_stages = [] } = req.body;

        if (!workspaceId) return res.status(400).json({ success: false, message: "Workspace ID is required" });
        if (!name?.trim()) return res.status(400).json({ success: false, message: "Project name is required" });

        const membership = await WorkspaceMemberModel.findOne({ user: userId, workspace: workspaceId });
        if (!membership) return res.status(403).json({ success: false, message: "You are not a member of this workspace" });

        const existingProject = await ProjectModel.findOne({ workspace: workspaceId, name: name.trim(), deletedAt: null });
        if (existingProject) return res.status(400).json({ success: false, message: "Project woth same name already exists" });
        if (end_date && new Date(end_date) < new Date()) return res.status(400).json({ message: "End date cannot be in the past" });

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

        const projectSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        let slug = projectSlug;
        let slugAttempt = 0;
        while (await ProjectModel.findOne({ workspace: workspaceId, slug })) {
            slugAttempt++;
            slug = `${projectSlug}-${slugAttempt}`;
        }
        const projectKey = await generateProjectKey(name);

        const project = await ProjectModel.create({
            name: name.trim(),
            slug,
            project_key: projectKey,
            description,
            projectIcon,
            priority,
            status,
            flowType,
            created_by: userId,
            workspace: workspaceId,
            end_date: end_date || null,
            budget,
            currency: currency.toUpperCase(),
            labels,
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
            const stages = await ProjectStagesModel.insertMany([
                { projectId: project._id, name: "To do", order: 1, isDefault: true },
                { projectId: project._id, name: "In Progress", order: 2 },
                { projectId: project._id, name: "Review", order: 3 },
                { projectId: project._id, name: "Done", order: 4, isDone: true }
            ]);

            project.stages = stages.map(s => s._id);
            project.currentStage = stages[0]._id;
        } else if (flowType === "Waterfall") {
            const stages = await ProjectStagesModel.insertMany([
                { projectId: project._id, name: "Requirements", order: 1, isDefault: true },
                { projectId: project._id, name: "Design", order: 2 },
                { projectId: project._id, name: "Development", order: 3 },
                { projectId: project._id, name: "Testing", order: 4 },
                { projectId: project._id, name: "Deployment", order: 5, isDone: true }
            ]);

            project.stages = stages.map(s => s._id);
            project.currentStage = stages[0]._id;
        } else {
            if (!project_stages.length) return res.status(400).json({ success: false, message: "Custom flow requires at least one stage" });
            
            const stages = project_stages.map((stage, index) => ({
                projectId: project._id,
                name: stage.name,
                order: index + 1,
                isDefault: index === 0,
                isDone: index === project_stages.length - 1,
                wipLimit: stage.wipLimit || null
            }));
            await ProjectStagesModel.insertMany(stages);

            project.stages = stages.map(s => s._id);
            project.currentStage = stages[0]._id;
        }

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

        await ProjectSettingsModel.create([{ projectId: project._id, enableSprints: flowType === "Agile" }]);
        await project.save();

        const activity = await createActivity({ userId, workspaceId, action: "PROJECT_CREATED", entityType: "Project", entityId: project._id, ip: req.ip, metadata: { projectName: project.name, flowType } });
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
                select: "role addedAt addedBy userId",
                populate: [{
                    path: "userId",
                    select: "name email profileImage lastLoggedIn",
                },
                {
                    path: "addedBy",
                    select: "name email profileImage",
                }],
            })
            .populate("created_by", "name email profileImage")
            .populate("stages", "name order color")
            .populate("currentStage", "name description order color")
            .populate("sprints", "name goal startDate endDate status velocity capacity taskCount completedTaskCount completedAt")
            .populate("currentSprint", "name goal startDate endDate status velocity capacity taskCount completedTaskCount completedAt")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const fetchProjectSettings = async (req, res) => {
    try {
        const { projectId } = req.params;

        let settings = await ProjectSettingsModel.findOne({ projectId });

        if (!settings) {
            settings = await ProjectSettingsModel.create({ projectId });
        }

        return res.status(200).json({ success: true, settings });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateProjectSettings = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const updatesAllowed = [
            "defaultTaskView", "enableTimeTracking", "enableCostTracking", "enableSprints",
            "enableSubTasks", "enableFileAttachments", "githubRepo", "isPublic", "notifyOnTaskCreate",
            "notifyOnTaskUpdate", "notifyOnComment"
        ]

        const updates = {};
        for (const key of updatesAllowed) {
            if (req.body[key] !== undefined) updates[key] = req.body[key];
        }

        const settings = await ProjectSettingsModel.findOneAndUpdate(
            { projectId },
            { $set: updates },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({ success: true, message: "Settings updated", settings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// import mongoose from "mongoose";
// import ProjectModel from "../models/project.model.js";
// import ProjectStagesModel from "../models/projectStages.model.js";
// import ProjectSettingsModel from "../models/projectSettings.model.js";
// import ProjectSprintsModel from "../models/projectSprints.model.js";
// import ProjectMembersModel from "../models/projectMembers.model.js";
// import WorkspaceMemberModel from "../models/workspaceMember.model.js";
// import ActivityModel from "../models/activity.model.js";

// /** Shared populate config used by all project queries */
// const PROJECT_POPULATE = [
//     {
//         path: "projectMembers",
//         match: { removedAt: null },
//         populate: { path: "userId", select: "name email profileImage" },
//     },
//     { path: "created_by", select: "name email profileImage" },
//     { path: "stages", match: { isArchived: false }, options: { sort: { order: 1 } } },
//     { path: "currentStage" },
//     { path: "sprints", options: { sort: { startDate: 1 } } },
//     { path: "currentSprint" },
// ];

// /** Log an activity entry (non-blocking — errors are swallowed) */
// const logActivity = async ({ workspaceId, projectId, userId, action, entityType, entityId, metadata, ip }) => {
//     try {
//         await ActivityModel.create({ workspaceId, projectId, userId, action, entityType, entityId, metadata, ip: ip || "0.0.0.0" });
//     } catch (err) {
//         console.error("[Activity log error]", err.message);
//     }
// };

// // ─── UPDATE PROJECT ───────────────────────────────────────────────────────────
// export const updateProject = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user.id;

//         if (!mongoose.Types.ObjectId.isValid(projectId)) {
//             return res.status(400).json({ success: false, message: "Invalid project ID" });
//         }

//         const allowed = [
//             "name", "description", "icon", "priority", "status", "health",
//             "start_date", "end_date", "labels", "budget", "spent_budget",
//             "currency", "progress", "currentStage", "currentSprint",
//         ];

//         const updates = {};
//         for (const key of allowed) {
//             if (req.body[key] !== undefined) updates[key] = req.body[key];
//         }

//         if (!Object.keys(updates).length) {
//             return res.status(400).json({ success: false, message: "No valid fields to update" });
//         }

//         if (updates.end_date && updates.start_date && new Date(updates.end_date) <= new Date(updates.start_date)) {
//             return res.status(400).json({ success: false, message: "End date must be after start date" });
//         }

//         const project = await ProjectModel.findOneAndUpdate(
//             { _id: projectId, deleted_at: null },
//             { $set: updates },
//             { new: true, runValidators: true }
//         ).populate(PROJECT_POPULATE);

//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         await logActivity({
//             workspaceId: project.workspace,
//             projectId: project._id,
//             userId,
//             action: "PROJECT_UPDATED",
//             entityType: "Project",
//             entityId: project._id,
//             metadata: { updatedFields: Object.keys(updates) },
//             ip: req.ip,
//         });

//         return res.status(200).json({ success: true, message: "Project updated successfully", project });
//     } catch (error) {
//         console.error("[updateProject]", error);
//         if (error.name === "ValidationError") {
//             return res.status(400).json({ success: false, message: error.message });
//         }
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── SOFT DELETE PROJECT ──────────────────────────────────────────────────────
// export const deleteProject = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const userId = req.user.id;

//         if (!mongoose.Types.ObjectId.isValid(projectId)) {
//             return res.status(400).json({ success: false, message: "Invalid project ID" });
//         }

//         const project = await ProjectModel.findOneAndUpdate(
//             { _id: projectId, deleted_at: null },
//             { $set: { deleted_at: new Date(), status: "Archived" } },
//             { new: true }
//         );

//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found or already deleted" });
//         }

//         await logActivity({
//             workspaceId: project.workspace,
//             projectId: project._id,
//             userId,
//             action: "PROJECT_DELETED",
//             entityType: "Project",
//             entityId: project._id,
//             metadata: { projectName: project.name },
//             ip: req.ip,
//         });

//         return res.status(200).json({ success: true, message: "Project deleted successfully" });
//     } catch (error) {
//         console.error("[deleteProject]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── ADD MEMBER ───────────────────────────────────────────────────────────────
// export const addProjectMember = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const { userId: targetUserId, role = "Contributor" } = req.body;
//         const requesterId = req.user.id;

//         const project = await ProjectModel.findOne({ _id: projectId, deleted_at: null });
//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         // Must be a workspace member
//         const wsMember = await WorkspaceMemberModel.findOne({ user: targetUserId, workspace: project.workspace });
//         if (!wsMember) {
//             return res.status(400).json({ success: false, message: "User is not a workspace member" });
//         }

//         // Check for existing active membership
//         const existingMember = await ProjectMembersModel.findOne({ userId: targetUserId, projectId, removedAt: null });
//         if (existingMember) {
//             return res.status(409).json({ success: false, message: "User is already a project member" });
//         }

//         // If they were previously removed, reactivate
//         const previousMember = await ProjectMembersModel.findOne({ userId: targetUserId, projectId });
//         let member;
//         if (previousMember) {
//             previousMember.role = role;
//             previousMember.removedAt = null;
//             previousMember.removedBy = null;
//             previousMember.addedBy = requesterId;
//             previousMember.addedAt = new Date();
//             member = await previousMember.save();
//         } else {
//             member = await ProjectMembersModel.create({ userId: targetUserId, projectId, role, addedBy: requesterId });
//             await ProjectModel.findByIdAndUpdate(projectId, { $addToSet: { projectMembers: member._id } });
//         }

//         await member.populate("userId", "name email profileImage");

//         return res.status(201).json({ success: true, message: "Member added to project", member });
//     } catch (error) {
//         console.error("[addProjectMember]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── REMOVE MEMBER ────────────────────────────────────────────────────────────
// export const removeProjectMember = async (req, res) => {
//     try {
//         const { projectId, memberId } = req.params;
//         const requesterId = req.user.id;

//         const member = await ProjectMembersModel.findOne({ _id: memberId, projectId, removedAt: null });
//         if (!member) {
//             return res.status(404).json({ success: false, message: "Member not found" });
//         }

//         if (member.role === "Lead") {
//             return res.status(400).json({ success: false, message: "Cannot remove the project Lead. Reassign Lead first." });
//         }

//         member.removedAt = new Date();
//         member.removedBy = requesterId;
//         await member.save();

//         return res.status(200).json({ success: true, message: "Member removed from project" });
//     } catch (error) {
//         console.error("[removeProjectMember]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── MANAGE STAGES ────────────────────────────────────────────────────────────
// export const addStage = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const { name, color = "#6366f1", wipLimit, insertAfterOrder } = req.body;

//         if (!name?.trim()) {
//             return res.status(400).json({ success: false, message: "Stage name is required" });
//         }

//         const project = await ProjectModel.findOne({ _id: projectId, deleted_at: null });
//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         // If inserting in the middle, shift orders up
//         const insertOrder = insertAfterOrder ? insertAfterOrder + 1 : (await ProjectStagesModel.countDocuments({ projectId })) + 1;

//         if (insertAfterOrder) {
//             await ProjectStagesModel.updateMany(
//                 { projectId, order: { $gte: insertOrder }, isArchived: false },
//                 { $inc: { order: 1 } }
//             );
//         }

//         const stage = await ProjectStagesModel.create({ projectId, name: name.trim(), color, order: insertOrder, wipLimit });
//         await ProjectModel.findByIdAndUpdate(projectId, { $push: { stages: stage._id } });

//         return res.status(201).json({ success: true, message: "Stage added", stage });
//     } catch (error) {
//         console.error("[addStage]", error);
//         if (error.code === 11000) {
//             return res.status(409).json({ success: false, message: "A stage with this name already exists" });
//         }
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const updateStage = async (req, res) => {
//     try {
//         const { projectId, stageId } = req.params;
//         const { name, color, wipLimit, isDone, order } = req.body;

//         const stage = await ProjectStagesModel.findOne({ _id: stageId, projectId });
//         if (!stage) {
//             return res.status(404).json({ success: false, message: "Stage not found" });
//         }

//         if (name  !== undefined) stage.name     = name.trim();
//         if (color !== undefined) stage.color    = color;
//         if (wipLimit !== undefined) stage.wipLimit = wipLimit;
//         if (isDone !== undefined) stage.isDone  = isDone;
//         if (order !== undefined) stage.order    = order;

//         await stage.save();
//         return res.status(200).json({ success: true, message: "Stage updated", stage });
//     } catch (error) {
//         console.error("[updateStage]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const deleteStage = async (req, res) => {
//     try {
//         const { projectId, stageId } = req.params;

//         const stage = await ProjectStagesModel.findOne({ _id: stageId, projectId });
//         if (!stage) {
//             return res.status(404).json({ success: false, message: "Stage not found" });
//         }
//         if (stage.isDefault) {
//             return res.status(400).json({ success: false, message: "Cannot delete the default stage" });
//         }

//         // Soft-archive instead of hard-delete to preserve task history
//         stage.isArchived = true;
//         await stage.save();

//         await ProjectModel.findByIdAndUpdate(projectId, { $pull: { stages: stage._id } });

//         return res.status(200).json({ success: true, message: "Stage archived" });
//     } catch (error) {
//         console.error("[deleteStage]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const reorderStages = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const { orderedStageIds } = req.body; // array of stageIds in desired order

//         if (!Array.isArray(orderedStageIds) || !orderedStageIds.length) {
//             return res.status(400).json({ success: false, message: "orderedStageIds array is required" });
//         }

//         const bulkOps = orderedStageIds.map((id, index) => ({
//             updateOne: {
//                 filter: { _id: id, projectId },
//                 update: { $set: { order: index + 1 } },
//             },
//         }));

//         await ProjectStagesModel.bulkWrite(bulkOps);
//         const stages = await ProjectStagesModel.find({ projectId, isArchived: false }).sort({ order: 1 });

//         return res.status(200).json({ success: true, message: "Stages reordered", stages });
//     } catch (error) {
//         console.error("[reorderStages]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── MANAGE SPRINTS ───────────────────────────────────────────────────────────
// export const createSprint = async (req, res) => {
//     try {
//         const { projectId } = req.params;
//         const { name, goal = "", startDate, endDate, capacity } = req.body;

//         if (!name?.trim()) {
//             return res.status(400).json({ success: false, message: "Sprint name is required" });
//         }
//         if (!endDate) {
//             return res.status(400).json({ success: false, message: "Sprint end date is required" });
//         }

//         const project = await ProjectModel.findOne({ _id: projectId, deleted_at: null });
//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         const sprint = await ProjectSprintsModel.create({
//             projectId,
//             name: name.trim(),
//             goal,
//             startDate: startDate || Date.now(),
//             endDate,
//             capacity: capacity || 0,
//         });

//         await ProjectModel.findByIdAndUpdate(projectId, { $push: { sprints: sprint._id } });

//         return res.status(201).json({ success: true, message: "Sprint created", sprint });
//     } catch (error) {
//         console.error("[createSprint]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// export const updateSprint = async (req, res) => {
//     try {
//         const { projectId, sprintId } = req.params;
//         const { name, goal, startDate, endDate, status, capacity, velocity } = req.body;

//         const sprint = await ProjectSprintsModel.findOne({ _id: sprintId, projectId });
//         if (!sprint) {
//             return res.status(404).json({ success: false, message: "Sprint not found" });
//         }

//         // Only one sprint can be Active at a time
//         if (status === "Active") {
//             const activeSprint = await ProjectSprintsModel.findOne({ projectId, status: "Active", _id: { $ne: sprintId } });
//             if (activeSprint) {
//                 return res.status(400).json({ success: false, message: "Another sprint is already active. Complete it first." });
//             }
//             if (status === "Active" && sprint.status !== "Planning") {
//                 return res.status(400).json({ success: false, message: "Only a Planning sprint can be started" });
//             }
//         }

//         if (status === "Completed") {
//             sprint.completedAt = new Date();
//         }

//         if (name      !== undefined) sprint.name      = name.trim();
//         if (goal      !== undefined) sprint.goal      = goal;
//         if (startDate !== undefined) sprint.startDate = startDate;
//         if (endDate   !== undefined) sprint.endDate   = endDate;
//         if (status    !== undefined) sprint.status    = status;
//         if (capacity  !== undefined) sprint.capacity  = capacity;
//         if (velocity  !== undefined) sprint.velocity  = velocity;

//         await sprint.save();

//         // Sync currentSprint on the project
//         if (status === "Active") {
//             await ProjectModel.findByIdAndUpdate(projectId, { currentSprint: sprint._id });
//         } else if (status === "Completed") {
//             const nextSprint = await ProjectSprintsModel.findOne({ projectId, status: "Planning" }).sort({ createdAt: 1 });
//             await ProjectModel.findByIdAndUpdate(projectId, { currentSprint: nextSprint?._id || null });
//         }

//         return res.status(200).json({ success: true, message: "Sprint updated", sprint });
//     } catch (error) {
//         console.error("[updateSprint]", error);
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ─── UPDATE SETTINGS ──────────────────────────────────────────────────────────