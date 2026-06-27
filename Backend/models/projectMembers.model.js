import mongoose from "mongoose";

const projectMembersSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    role: { type: String, enum: ['Lead', 'Developer', 'Reviewer', 'Tester', 'Guest'], default: 'Developer' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

projectMembersSchema.index({ userId: 1, projectId: 1 }, { unique: true });
const ProjectMembersModel = mongoose.model('ProjectMember', projectMembersSchema);

export default ProjectMembersModel;

// import mongoose from "mongoose";

// const projectMembersSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: [true, "User ID is required"],
//         },
//         projectId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Project",
//             required: [true, "Project ID is required"],
//         },
//         role: {
//             type: String,
//             enum: {
//                 values: ["Lead", "Developer", "Reviewer", "Contributor", "Guest"],
//                 message: "Role must be Lead, Developer, Reviewer, Contributor, or Guest",
//             },
//             default: "Contributor",
//         },
//         addedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null,
//         },
//         addedAt: {
//             type: Date,
//             default: Date.now,
//         },
//         // When a member is removed, we soft-delete instead of destroying the record
//         // so task assignment history is preserved
//         removedAt: {
//             type: Date,
//             default: null,
//         },
//         removedBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             default: null,
//         },
//     },
//     { timestamps: true }
// );

// // ── Indexes ────────────────────────────────────────────────────────────────────
// // One membership record per user per project
// projectMembersSchema.index({ userId: 1, projectId: 1 }, { unique: true });
// // Quick lookup of all members of a project
// projectMembersSchema.index({ projectId: 1, removedAt: 1 });

// // ── Virtuals ───────────────────────────────────────────────────────────────────
// projectMembersSchema.virtual("id").get(function () {
//     return this._id.toString();
// });

// projectMembersSchema.virtual("isActive").get(function () {
//     return this.removedAt === null;
// });

// projectMembersSchema.set("toJSON", { virtuals: true });
// projectMembersSchema.set("toObject", { virtuals: true });

// const ProjectMembersModel = mongoose.model("ProjectMember", projectMembersSchema);
// export default ProjectMembersModel;