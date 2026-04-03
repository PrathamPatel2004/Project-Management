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
    ownedWorkspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }],
    ProjectMember: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectMember' }],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    systemRole: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);
export default UserModel;