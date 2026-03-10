import WorkspaceModel from "../models/workspace.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";

export const fetchWorkspaces = async (req, res) => {
    try {
        const userId = req.user.id;
        const memberships = await WorkspaceMemberModel.find({ user: userId }).populate("workspace", "name image_url description slug");

        const workspaces = memberships.map((m) => m.workspace);

        res.status(200).json({ workspaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching workspaces" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, slug, image_url, description } = req.body;
        const existing = await WorkspaceModel.findOne({ slug });
        
        if (existing) {
            return res.status(400).json({ message: "Workspace slug already exists" });
        }

        const workspace = await WorkspaceModel.create({ name, slug, image_url, description, owner: userId });

        await WorkspaceMemberModel.create({ user: userId, workspace: workspace._id, role: "Admin" });

        res.status(201).json({ message: "Workspace created successfully", workspace });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating workspace" });
    }
};