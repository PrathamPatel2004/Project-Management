import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from '../features/workspaceSlice'

export const store = configureStore({
    reducer : {
        workspace : workspaceReducer
    }
})