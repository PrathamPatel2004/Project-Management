import { Router } from 'express';
import { fetchWorkspaces, createWorkspace, inviteWorkspaceMembers, acceptWorkspaceInvite, getWorkspaceMembers } from '../controllers/workspace.controller.js';
import { workspaceContext } from "../middleware/workspaceRole.middleware.js";
import { requireWorkspacePermission } from "../middleware/permission.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import auth from "../middleware/auth.middleware.js";

const workspaceRouter = Router();

workspaceRouter.get('/get-workspaces', auth, fetchWorkspaces);
workspaceRouter.post('/create-workspace', auth, createWorkspace);
workspaceRouter.post("/:workspaceId/invite", auth, workspaceContext, requireWorkspacePermission(PERMISSIONS.WORKSPACE_INVITE), inviteWorkspaceMembers);
workspaceRouter.post("/invite/accept", auth, acceptWorkspaceInvite);
workspaceRouter.get('/:workspaceId/workspace-members', auth, workspaceContext, requireWorkspacePermission(PERMISSIONS.MEMBER_VIEW), getWorkspaceMembers);

export default workspaceRouter;