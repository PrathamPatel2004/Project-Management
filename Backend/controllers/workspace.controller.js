import sendEmail from  "../config/sendEmail.js"
import WorkspaceModel from "../models/workspace.model.js";
import UserModel from "../models/user.model.js";
import WorkspaceMemberModel from "../models/workspaceMember.model.js";
import WorkspaceInvitationModel from "../models/workspaceInvitation.model.js";
import ActivityModel from "../models/activity.model.js";
import { generateInviteToken, verifyInviteToken } from "../services/workspace.service.js"
import { createActivity } from "../services/activity.service.js";

export const fetchWorkspaces = async (req, res) => {
    try {
        const userId = req.user.id;

        // STEP 1: Get memberships only
        const memberships = await WorkspaceMemberModel.find({ user: userId }).select("workspace role").lean();
        const workspaceIds = memberships.map(m => m.workspace);
 
        // STEP 2: Fetch minimal workspace info
        const workspaces = await WorkspaceModel.find({ _id: { $in: workspaceIds } }).select("name slug logo description owner").lean();

        // STEP 3: Attach role info
        const workspaceMap = {};

        memberships.forEach(m => {
            workspaceMap[
                m.workspace.toString()
            ] = m.role;
        });

        const result = workspaces.map(ws => ({ ...ws, role: workspaceMap[ws._id.toString()] }));

        res.status(200).json({ workspaces: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching workspaces" });
    }
};

export const createWorkspace = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, slug, logo, description } = req.body;
        const existing = await WorkspaceModel.findOne({ slug });
        
        if (existing) {
            return res.status(400).json({ message: "Workspace slug already exists" });
        }

        const workspace = await WorkspaceModel.create({ name, slug, logo, description, owner: userId });

        await WorkspaceMemberModel.create({ user: userId, workspace: workspace._id, role: "Owner" });
        await createActivity({ userId, workspaceId: workspace._id, action: "WORKSPACE_CREATED", entityType: "Workspace", entityId: workspace._id, ip: req.ip, metadata: { workspace: workspace.name } });

        res.status(201).json({ message: "Workspace created successfully", workspace });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating workspace" });
    }
};

export const inviteWorkspaceMembers = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { workspaceId } = req.params;
        const { invites } = req.body;

        const workspace = await WorkspaceModel.findById(workspaceId)
        const invitePromises = invites.map(async (inviteData) => {
            const { email, role } = inviteData;

            const existingUser = await UserModel.findOne({ email }).select("_id name email").lean();

            const { rawToken, hashedToken } = await generateInviteToken();

            let invite = await WorkspaceInvitationModel.create({ workspace: workspaceId, email, role, invitedBy: userId, token: hashedToken, expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) });
            invite = await invite.populate("invitedBy", "name email profileImage lastLoggedIn");

            if (existingUser) {
                const inviteLink = `${process.env.FRONTEND_URL}/workspace/invite?token=${rawToken}`;
                await sendEmail({
                    sendTo: email,
                    subject: `Workspace Invitation for ${workspace.name} workspace`,
                    html: `<h3>You’ve been invited</h3>
                            <a href="${inviteLink}">Accept Invitation</a>`
                });
            } else {
                const signupLink = `${process.env.FRONTEND_URL}/auth/signup?inviteToken=${rawToken}`;
                await sendEmail({
                    sendTo: email,
                    subject: `Join ${workspace.name} Workspace`,
                    html: `<h3>Create account</h3>
                            <a href="${signupLink}">Signup & Join</a>`
                });
            }
            return invite;
        })

        const results = await Promise.all(invitePromises);
        await createActivity({ userId, workspaceId, action: `MEMBERS_INVITED`, entityType: "Workspace", entityId: workspaceId, ip: req.ip, metadata: { emails: invites.map(invite => invite.email) } });

        res.json({ message: "Invitations processed", invites: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const acceptWorkspaceInvite = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user.id;

        const invite = await verifyInviteToken(userId, token);
        res.json({
            message: "Joined workspace successfully",
            workspaceId: invite.workspace
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getWorkspaceMembers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { workspaceId } = req.params;

        const [ members, invitations ] = await Promise.all([
            WorkspaceMemberModel.find({ workspace: workspaceId }).select("user role joinedAt").populate("user", "name email profileImage lastLoggedIn").lean(),
            WorkspaceInvitationModel.find({ workspace: workspaceId, acceptedAt: null, expiresAt: { $gt: new Date() } }).select("email role invitedBy expiresAt").populate("invitedBy", "name email profileImage").lean()
        ]);

        const currentUserRole = await WorkspaceMemberModel.findOne({ user: userId, workspace: workspaceId }).select("role").lean();

        res.status(200).json({ members, invitations, currentUserRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching workspace members" });
    }
};