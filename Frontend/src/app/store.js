import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspaceSlice'
import projectReducer from "../features/projectSlice";
import workspaceMemberReducer from "../features/workspaceMemberSlice";
import activityReducer from "../features/activitySlice";
import taskReducer from "../features/tasksSlice"

export const store = configureStore({
    reducer : {
        workspace : workspaceReducer,
        projects : projectReducer,
        workspaceMembers : workspaceMemberReducer,
        activity : activityReducer,
        tasks : taskReducer
    }
})