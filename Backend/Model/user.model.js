import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email : { type : String, required : true, unique : true, lowercase : true },
    hashedPassword: { type: String, default: null },
    profileImage: { type: String, default: "" },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    isEmailVerified: { type: Boolean, default: false },
    verifiedByGoogle: { type: Boolean, default: false },
    googleUid : { type : String, default : null },
    lastLoggedIn : { type : Date, default : null },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMember' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    ownedWorkspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    ProjectMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }],
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;