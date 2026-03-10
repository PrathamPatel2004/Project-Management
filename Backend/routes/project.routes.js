import { Router } from "express";
import { fetchProjects, createProject } from "../controllers/project.controller.js";
import auth from "../middleware/auth.middleware.js";

const projectRouter = Router();

projectRouter.get('/:workspaceId/projects', fetchProjects);
projectRouter.post('/create-project', auth, createProject);

export default projectRouter;
