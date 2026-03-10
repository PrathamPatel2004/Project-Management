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
      state.projects.push(action.payload);
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
        state.projects = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addProject, updateProject, deleteProject } = projectSlice.actions;

export default projectSlice.reducer;