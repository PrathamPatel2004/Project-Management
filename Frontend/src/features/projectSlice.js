import axios from "axios";
import api from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProjects = createAsyncThunk(
    "projects/fetchProjects",
    async (currentWorkspaceId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/project/${currentWorkspaceId}/projects`);
            return data.projects;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchProjectSettings = createAsyncThunk(
    "projects/fetchProjectSettings",
    async (projectId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/project/${projectId}/settings`);
            return data.settings;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

const initialState = {
    projects: [],
    loading: false,
    error: null,
};

const projectSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        addProject: (state, action) => {
            state.projects.unshift(action.payload);
        },

        clearProjects: (state) => {
            state.projects = [];
            state.loading = false;
            state.error = null;
        },

        updateProject: (state, action) => {
            state.projects = state.projects.map((p) =>
                p._id === action.payload._id ? action.payload : p
            );
        },

        deleteProject: (state, action) => {
            state.projects = state.projects.filter(
                (p) => p._id !== action.payload
            );
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchProjects.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
            state.loading = false;
            state.projects = (action.payload || []).map(p => ({
                ...p,
                id: String(p._id),
            }));
        })
        .addCase(fetchProjects.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { addProject, updateProject, deleteProject, clearProjects } = projectSlice.actions;

export default projectSlice.reducer;