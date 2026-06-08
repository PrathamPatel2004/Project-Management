import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email : { type : String, required : true, unique : true, lowercase : true },
    hashedPassword: { type: String, default: null },
    profileImage: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    provider: { type: String, enum: ["Local", "Google", "Github"], default: "Local" },
    isEmailVerified: { type: Boolean, default: false },
    verifiedByGoogle: { type: Boolean, default: false },
    verifiedByGithub: { type: Boolean, default: false },
    googleUid : { type : String, default : null },
    githubUid : { type : String, default : null },
    lastLoggedIn : { type : Date, default : null },
    ownedWorkspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    ProjectMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    systemRole: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    lastActiveAt: { type: Date, default: Date.now },
}, { timestamps: true });

userSchema.index({ googleUid: 1 });
userSchema.index({ githubUid: 1 });
const UserModel = mongoose.model("User", userSchema);
export default UserModel;