import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspaceSlice'
import projectReducer from "../features/projectSlice";

export const store = configureStore({
    reducer : {
        workspace : workspaceReducer,
        projects : projectReducer
    }
})