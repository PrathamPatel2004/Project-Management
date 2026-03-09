import { Router } from 'express';
import { fetchWorkspaces, createWorkspace } from '../controllers/workspace.controller.js';
import auth from "../middleware/auth.middleware.js";

const workspaceRouter = Router();

workspaceRouter.get('/get-workspaces', auth, fetchWorkspaces);
workspaceRouter.post('/create-workspace', auth, createWorkspace);

export default workspaceRouter;