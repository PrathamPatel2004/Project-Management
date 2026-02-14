import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, enum: ['VERIFY', 'RESET', 'REFRESH'] },
    token: { type: String, required: true },
    expiresAt : { type : Date, required : true }
}, { timestamps: true });

userTokenSchema.index({ expiresAt : 1 }, { expireAfterSeconds : 0 });
const UserTokenModel = mongoose.model("UserToken", userTokenSchema);

export default UserTokenModel;