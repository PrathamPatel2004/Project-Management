import api from '../api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWorkspaces = createAsyncThunk(
    '/workspace/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/api/workspace/get-workspaces');
            return data.workspaces;
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
            const id = String(action.payload);
            localStorage.setItem("currentWorkspaceId", id);

            const found = state.workspaces.find((w) => String(w.id) === id);
            state.currentWorkspace = found || state.currentWorkspace || null;
        },

        addWorkspace: (state, action) => {
            const workspace = {
                ...action.payload,
                id: String(action.payload._id),
            };

            state.workspaces.push(workspace);
            state.currentWorkspace = workspace;
            localStorage.setItem("currentWorkspaceId", workspace.id);
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

                state.workspaces = (action.payload || []).map(w => ({
                    ...w,
                    id: String(w._id),
                }));

                const savedId = localStorage.getItem("currentWorkspaceId");

                const selected =
                    state.workspaces.find((w) => w.id === savedId) ||
                    state.workspaces[0] ||
                    null;

                state.currentWorkspace = selected;

                if (selected) {
                    localStorage.setItem("currentWorkspaceId", selected.id);
                } else {
                    localStorage.removeItem("currentWorkspaceId");
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