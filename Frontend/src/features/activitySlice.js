import api from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWorkspaceActivity = createAsyncThunk(
    "activity/fetchWorkspaceActivity",
    async (workspaceId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/activity/${workspaceId}`);
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchProjectActivity = createAsyncThunk(
    "activity/fetchProjectActivity",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/activity/${projectId}`);
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

const initialState = {
    activities: [],
    loading: false,
    error: null,
};

const activitySlice = createSlice({
    name: "activity",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWorkspaceActivity.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchWorkspaceActivity.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.activities = action.payload.activities || [];
        });
        builder.addCase(fetchWorkspaceActivity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(fetchProjectActivity.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProjectActivity.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.activities = action.payload.activities || [];
        });
        builder.addCase(fetchProjectActivity.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default activitySlice.reducer;