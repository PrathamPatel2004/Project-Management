import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

const normalizeMember = (m) => ({
    ...m,
    id: String(m._id),
});

const normalizeInvite = (i) => ({
    ...i,
    id: String(i._id),
});

export const fetchWorkspaceMembers = createAsyncThunk(
    "workspaceMembers/fetch",
    async (workspaceId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/api/workspace/${workspaceId}/workspace-members`);
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const inviteMembers = createAsyncThunk(
    "workspaceMembers/invite",
    async ({ workspaceId, invites }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/api/workspace/${workspaceId}/invite`, { invites });
            return data.invites;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// 🔹 Update member role
export const updateMemberRole = createAsyncThunk(
    "workspacePeople/updateRole",
    async ({ memberId, role }, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(
                `/api/workspace/member/${memberId}/role`,
                { role }
            );
            return data; // updated member
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// // 🔹 Remove member
export const removeMember = createAsyncThunk(
    "workspacePeople/removeMember",
    async (memberId, { rejectWithValue }) => {
        try {
            await api.delete(`/api/workspace/member/${memberId}`);
            return memberId;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// // 🔹 Cancel invitation (optional but useful)
// export const cancelInvitation = createAsyncThunk(
//     "workspacePeople/cancelInvite",
//     async (inviteId, { rejectWithValue }) => {
//         try {
//             await api.delete(`/api/workspace/invite/${inviteId}`);
//             return inviteId;
//         } catch (err) {
//             return rejectWithValue(err.response?.data || err.message);
//         }
//     }
// );

// /* -------------------- INITIAL STATE -------------------- */

const initialState = {
    members: [],
    invitations: [],
    currentUserRole: null,
    loading: {
        fetch: false,
        invite: false,
    },
    error: null,
};

const workspaceMemberSlice = createSlice({
    name: "workspaceMembers",
    initialState,
    reducers: {
        setMembers: (state, action) => {
            state.members = action.payload.map(normalizeMember);
        },
        addMember: (state, action) => {
            const member = normalizeMember(action.payload);
            const exists = state.members.find((m) => m.id === member.id);

            if (!exists) {
                state.members.push(member);
            }
        },
//         // 🔹 Remove member locally (optional helper)
//         removeMemberLocal: (state, action) => {
//             state.members = state.members.filter(
//                 (m) => m.id !== action.payload
//             );
//         },

//         // 🔹 Add invitation manually
        addInvitation: (state, action) => {
            const invite = normalizeInvite(action.payload);

            const exists = state.invitations.find((i) => i.id === invite.id);
            if (!exists) {
                state.invitations.push(invite);
            }
        },

//         // 🔹 Remove invitation
//         removeInvitation: (state, action) => {
//             state.invitations = state.invitations.filter(
//                 (i) => i.id !== action.payload
//             );
//         },

//         // 🔹 Clear all (useful on logout)
//         clearWorkspacePeople: (state) => {
//             state.members = [];
//             state.invitations = [];
//         },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkspaceMembers.pending, (state) => {
            state.loading.fetch = true;
            state.error = null;
        })
        .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
            state.loading.fetch = false;
            state.members = (action.payload.members || []).map(normalizeMember);
            state.invitations = (action.payload.invitations || []).map(normalizeInvite);
            state.currentUserRole = action.payload.currentUserRole?.role;
        })
        .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
            state.loading.fetch = false;
            state.error = action.payload || "Failed to fetch people";
        })
        .addCase(inviteMembers.pending, (state) => {
            state.loading.invite = true;
        })
        .addCase(inviteMembers.fulfilled, (state, action) => {
            state.loading.invite = false;
            const newInvites = action.payload.map(normalizeInvite);
            newInvites.forEach((invite) => {
                const exists = state.invitations.find(i => i.id === invite.id);
                if (!exists) {
                    state.invitations.push(invite);
                }
            });
        })
        .addCase(inviteMembers.rejected, (state) => {
            state.loading.invite = false;
        })
        /* ---------------- REMOVE MEMBER ---------------- */
        .addCase(removeMember.pending, (state) => {
            state.loading.remove = true;
        })
        .addCase(removeMember.fulfilled, (state, action) => {
            state.loading.remove = false;
            state.members = state.members.filter(
                (m) => m.id !== action.payload
            );
        })
        .addCase(removeMember.rejected, (state) => {
            state.loading.remove = false;
        })
        /* ---------------- UPDATE ROLE ---------------- */
        .addCase(updateMemberRole.pending, (state) => {
            state.loading.updateRole = true;
        })
        .addCase(updateMemberRole.fulfilled, (state, action) => {
            state.loading.updateRole = false;
            const updated = normalizeMember(action.payload);
            const index = state.members.findIndex(
                (m) => m.id === updated.id
            );
            if (index !== -1) {
                state.members[index] = updated;
            }
        })
        .addCase(updateMemberRole.rejected, (state) => {
            state.loading.updateRole = false;
        })

        // /* ---------------- CANCEL INVITE ---------------- */
        // .addCase(cancelInvitation.pending, (state) => {
        //     state.loading.cancelInvite = true;
        // })
        // .addCase(cancelInvitation.fulfilled, (state, action) => {
        //     state.loading.cancelInvite = false;
        //     state.invitations = state.invitations.filter(
        //         (i) => i.id !== action.payload
        //     );
        // })
        // .addCase(cancelInvitation.rejected, (state) => {
        //     state.loading.cancelInvite = false;
        // });
    },
});

export const { setMembers, addMember, addInvitation } = workspaceMemberSlice.actions
export default workspaceMemberSlice.reducer;

// export const {
//     setMembers,
//     addMember,
//     removeMemberLocal,
//     addInvitation,
//     removeInvitation,
//     clearWorkspacePeople,
// } = workspaceMemberSlice.actions;

// export default workspaceMemberSlice.reducer;