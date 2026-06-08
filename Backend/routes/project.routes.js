import { Router } from "express";
import { fetchProjects, createProject, getProjectById } from "../controllers/project.controller.js";
import auth from "../middleware/auth.middleware.js";

const projectRouter = Router();

projectRouter.get('/:workspaceId/projects', auth, fetchProjects);
projectRouter.post('/create-project', auth, createProject);
projectRouter.get('/project/:projectId', auth, getProjectById);

export default projectRouter;