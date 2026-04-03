import WorkspaceMemberModel from "../models/workspaceMember.model.js";
import { hasPermission } from "../config/permissions.js";

export const requireWorkspacePermission = (permission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const workspaceId =
                req.params.workspaceId || req.body.workspaceId;

            if (!workspaceId) {
                return res.status(400).json({
                    message: "Workspace ID required",
                });
            }

            const membership = await WorkspaceMemberModel.findOne({
                user: userId,
                workspace: workspaceId,
            });

            if (!membership) {
                return res.status(403).json({
                    message: "You are not a member of this workspace",
                });
            }

            const role = membership.role;

            if (!hasPermission(role, permission)) {
                return res.status(403).json({
                    message: "Forbidden: insufficient permissions",
                });
            }

            req.workspaceRole = role;
            req.workspaceMember = membership;

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Authorization error" });
        }
    };
};            