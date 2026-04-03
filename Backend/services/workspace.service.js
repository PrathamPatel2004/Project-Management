import crypto from "crypto";
import WorkspaceInvitationModel from "../models/workspaceInvitation.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";
import UserModel from "../models/user.model.js";

export const generateInviteToken = async () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken  = crypto.createHash('sha256').update(rawToken).digest('hex');

    return { rawToken, hashedToken };
};

export const verifyInviteToken = async (userId, token) => {
    const user = await UserModel.findById(userId);

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const invite = await WorkspaceInvitationModel.findOne({
        token: hashedToken,
        expiresAt: { $gt: new Date() },
        acceptedAt: null
    });

    if (!invite) throw new Error("Invalid or expired invite");

    if (invite.email !== user.email) {
        throw new Error("This invite is not for your email");
    }

    await WorkspaceMemberModel.updateOne(
        { user: userId, workspace: invite.workspace },
        {
            $setOnInsert: {
                role: invite.role,
            }
        },
        { upsert: true }
    );

    invite.acceptedAt = new Date();
    await invite.save();

    return invite;
};