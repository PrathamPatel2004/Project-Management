import ProjectModel from "../models/project.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";

export const fetchProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const projects = await ProjectModel.find({ workspace: workspaceId }).populate("team_lead", "name email profileImage").lean();
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching projects" });
    }
};

export const createProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, priority, status, end_date, team_lead, workspaceId } = req.body;

        const membership = await WorkspaceMemberModel.findOne({ user: userId, workspace: workspaceId });

        if (!membership) {
            return res.status(403).json({
                message: "You are not a member of this workspace",
            });
        }

        const existingProject = await ProjectModel.findOne({ name, workspace: workspaceId });

        if (existingProject) {
            return res.status(400).json({ message: "Project with this name already exists" });
        }

        const teamLeadMember = await WorkspaceMemberModel.findOne({ user: team_lead, workspace: workspaceId });

        if (!teamLeadMember) {
            return res.status(400).json({ message: "Team lead must be a workspace member" });
        }

        if (end_date && new Date(end_date) < new Date()) {
            return res.status(400).json({ message: "End date cannot be in the past" });
        }
        const ProjectKey = name.replace(/\s+/g, '-').toUpperCase().replace(/[^a-zA-Z0-9]/g, '');
    
        const project = await ProjectModel.create({ 
            name, 
            project_key: ProjectKey, 
            description, 
            priority,
            status,
            start_date: new Date(),
            end_date,
            team_lead,
            created_by: userId,
            workspace: workspaceId
        });
        res.status(201).json({ message: "Project created successfully", project });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating project" });
    }
};