import WorkspaceModel from "../models/workspace.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";
import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const workspaceContext = async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId || req.body.workspaceId;

        if (!workspaceId) {
            return res.status(400).json({ message: "Workspace ID is required" });
        }

        const workspace = await WorkspaceModel.findById(workspaceId).lean();

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        let member = await WorkspaceMemberModel.findOne({
            workspace: workspaceId,
            user: req.user.id,
        }).lean();

        if (!member) {
            return res.status(403).json({ message: "Not a workspace member" });
        }

        req.workspace = workspace;
        req.workspaceMember = member;
        req.workspaceRole = member.role;
        req.workspacePermissions = ROLE_PERMISSIONS[member.role] || [];

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};