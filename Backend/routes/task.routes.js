import { Router } from "express";
import { createProjectTask, fetchProjectTasks, getTaskById, updateTask, deleteTask } from "../controllers/task.controller.js";
import auth from "../middleware/auth.middleware.js";

const taskRouter = Router();

taskRouter.post("/:projectId/create-task", auth, createProjectTask);
taskRouter.get('/:projectId/tasks', auth, fetchProjectTasks);
taskRouter.get("/get-task/:taskId", auth, getTaskById);
taskRouter.put("/update-task/:taskId", auth, updateTask);
taskRouter.delete("/delete-task/:taskId", auth, deleteTask);

export default taskRouter;