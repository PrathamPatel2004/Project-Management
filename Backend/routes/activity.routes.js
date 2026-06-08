import { Router } from 'express';
import { getProjectActivity, getWorkspaceActivity } from '../controllers/activity.controller.js';
import auth from '../middleware/auth.middleware.js';

const activityRouter = Router();

activityRouter.get('/:workspaceId',auth, getWorkspaceActivity)
activityRouter.get('/:workspaceId/:projectId',auth, getProjectActivity)

export default activityRouter;