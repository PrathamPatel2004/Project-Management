import { Router } from "express";
import { fetchProjects, createProject, fetchProjectSettings } from "../controllers/project.controller.js";
import auth from "../middleware/auth.middleware.js";

const projectRouter = Router();

projectRouter.get('/:workspaceId/projects', auth, fetchProjects);
projectRouter.post('/create-project', auth, createProject);
projectRouter.get('/:projectId/settings', auth, fetchProjectSettings);

export default projectRouter;

// import { Router } from "express";
// import auth from "../middleware/auth.middleware.js";
// import { requireWorkspacePermission } from "../middleware/permission.middleware.js";
// import { PERMISSIONS } from "../config/permissions.js";
// import {
//     createProject,
//     fetchProjects,
//     getProjectById,
//     updateProject,
//     deleteProject,
//     addProjectMember,
//     removeProjectMember,
//     addStage,
//     updateStage,
//     deleteStage,
//     reorderStages,
//     createSprint,
//     updateSprint,
//     updateProjectSettings,
// } from "../controllers/project.controller.js";

// const projectRouter = Router();

// // ── Projects ──────────────────────────────────────────────────────────────────
// projectRouter.post(
//     "/create-project",
//     auth,
//     requireWorkspacePermission(PERMISSIONS.PROJECT_CREATE),
//     createProject
// );
// projectRouter.get(
//     "/:workspaceId/projects",
//     auth,
//     requireWorkspacePermission(PERMISSIONS.PROJECT_VIEW),
//     fetchProjects
// );
// projectRouter.patch(
//     "/project/:projectId",
//     auth,
//     updateProject
// );
// projectRouter.delete(
//     "/project/:projectId",
//     auth,
//     deleteProject
// );

// // ── Members ───────────────────────────────────────────────────────────────────
// projectRouter.post(
//     "/project/:projectId/members",
//     auth,
//     addProjectMember
// );
// projectRouter.delete(
//     "/project/:projectId/members/:memberId",
//     auth,
//     removeProjectMember
// );

// // ── Stages ────────────────────────────────────────────────────────────────────
// projectRouter.post(
//     "/project/:projectId/stages",
//     auth,
//     addStage
// );
// projectRouter.patch(
//     "/project/:projectId/stages/:stageId",
//     auth,
//     updateStage
// );
// projectRouter.delete(
//     "/project/:projectId/stages/:stageId",
//     auth,
//     deleteStage
// );
// projectRouter.put(
//     "/project/:projectId/stages/reorder",
//     auth,
//     reorderStages
// );

// // ── Sprints ───────────────────────────────────────────────────────────────────
// projectRouter.post(
//     "/project/:projectId/sprints",
//     auth,
//     createSprint
// );
// projectRouter.patch(
//     "/project/:projectId/sprints/:sprintId",
//     auth,
//     updateSprint
// );

// // ── Settings ──────────────────────────────────────────────────────────────────
// projectRouter.patch(
//     "/project/:projectId/settings",
//     auth,
//     updateProjectSettings
// );

// export default projectRouter;