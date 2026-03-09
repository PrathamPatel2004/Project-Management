import UserModel from '../models/user.model.js';
import WorkspaceModel from '../models/workspace.model.js';
import WorkspaceMemberModel from '../models/workspaceMember.model.js';

export const fetchWorkspaces = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await UserModel.findById(userId).select("workspaces");

        const workspaces = await WorkspaceModel.find({
            _id: { $in: user.workspaces }
        }).select("name image_url description");

        res.status(200).json({ workspaces });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, slug, image_url, description } = req.body;

        const workspace = await WorkspaceModel.create({ name, slug, image_url, owner: userId, description })
        const membership = await WorkspaceMemberModel.create({ user: userId, workspace: workspace._id, role: 'Admin' });

        const user = await UserModel.findById(userId);
        user.workspaces.push(workspace._id);
        user.ownedWorkspaces.push(workspace._id);
        await user.save();

        res.status(201).json({ workspace });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};