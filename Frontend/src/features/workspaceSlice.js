import api from '../api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWorkspaces = createAsyncThunk(
    'workspace/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('workspace/get-all');
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
};

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setCurrentWorkspace: (state, action) => {
            const id = action.payload;
            localStorage.setItem("currentWorkspaceId", String(id));

            state.currentWorkspace =
                state.workspaces.find((w) => String(w.id) === String(id)) || null;
        },

        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);
            state.currentWorkspace = action.payload;
            localStorage.setItem("currentWorkspaceId", String(action.payload.id));
        },

        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },

        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter(
                (w) => w.id !== action.payload
            );

            if (state.currentWorkspace?.id === action.payload) {
                state.currentWorkspace = state.workspaces[0] || null;

                if (state.currentWorkspace) {
                    localStorage.setItem(
                        "currentWorkspaceId",
                        String(state.currentWorkspace.id)
                    );
                } else {
                    localStorage.removeItem("currentWorkspaceId");
                }
            }
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload || [];

                const savedId = localStorage.getItem("currentWorkspaceId");

                const selected =
                    state.workspaces.find((w) => String(w.id) === String(savedId)) ||
                    state.workspaces[0] ||
                    null;

                state.currentWorkspace = selected;

                if (selected) {
                    localStorage.setItem("currentWorkspaceId", String(selected.id));
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to load workspaces";
            });
    },
});

export const {
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;