import axios from "axios";
import api from "../api/axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (projectId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/tasks/${projectId}/tasks`);
            return data.tasks;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchProjectTaskById = createAsyncThunk(
    "task/fetchProjectTaskById",
    async (taskId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/tasks/get-task/${taskId}`);
            return data.task;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

const initialState = {
    tasks: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.unshift(action.payload);
        },

        clearTasks: (state) => {
            state.tasks = [];
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchTasks.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.tasks = (action.payload || []).map(t => ({
                ...t,
                id: String(t._id),
            }));
        })
        .addCase(fetchTasks.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { addProjectTask, clearTasks } = taskSlice.actions;

export default taskSlice.reducer;