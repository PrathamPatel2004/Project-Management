import { createUser, verifyUser, generateTokens, matchPassword, findUserByEmail } from '../services/user.service.js';
import UserModel from '../models/user.model.js';
import UserTokenModel from '../models/userToken.model.js';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from '../utils/verifyEmailTemplate.util.js';
import admin from '../config/firebaseAdmin.js';
import bcryptjs from 'bcryptjs';

import dotenv from "dotenv";
import welcomeEmailTemplate from '../utils/welcomeEmailTemplate.util.js';
dotenv.config();

export const signup = async (req, res) => {
    try {
        const { fname, lname, email, password, image } = req.body;

        if (!fname || !lname || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const name = `${fname} ${lname}`;

        const { user, rawToken } = await createUser({ name, email, password, image, verificationExpiresAt: new Date(Date.now() + 20 * 60 * 1000) });

        const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify?verificationToken=${rawToken}`;

        await sendEmail({
            sendTo: user.email,
            subject: "Verify Your Signup",
            html: verifyEmailTemplate(verificationUrl, user.name),
        })
        return res.status(200).json({ message: "User created successfully. Please verify your email." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const verifyEmailLink = async (req, res) => {
    try {
        const { verificationToken } = req.body;

        if (!verificationToken) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        await verifyUser(verificationToken);

        await sendEmail({
            sendTo: user.email,
            subject: "Welcome to Project Management",
            html: welcomeEmailTemplate(user.name),
        })
        return res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: "User not found" });
        
        if (!user.isEmailVerified)
        return res.status(403).json({ message: "Email not verified" });
        
        const isMatch = await matchPassword({ user, password });
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only on HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 30,}
        );

        return res.json({ success: true, message: "Login successful", accessToken, user });
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
}

export const verifyAccessToken = async (req, res) => {
    try {
        res.set("Cache-Control", "no-store");

        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

        if (!token) return res.status(401).json({ message: "No token" });

        const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
        const user = await UserModel.findById(decoded.id).select("-hashedPassword");

        if (!user) return res.status(401).json({ message: "User not found" });

        return res.json({ success: true, user });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });   
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
        } catch {
            return res.status(401).json({ message: "Refresh token expired" });
        }
        const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const validateToken = await UserTokenModel.findOne({ token: hashed, type: "REFRESH" });
        if (!validateToken) return res.status(401).json({ message: "Invalid refresh token" });

        await validateToken.deleteOne();

        const user = await UserModel.findById(decoded.id);

        if (!user) return res.status(401).json({ message: 'User not found' });

        const tokens = await generateTokens(user);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true only on HTTPS
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 30,}
        );
        return res.status(200).json({ message: 'Access token refreshed successfully', accessToken: tokens.accessToken });
    } catch (err) {
        res.status(500).json({ message: "Session expired" });
    }
}

export const logoutController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await UserTokenModel.deleteOne({ token: hashed, type: "REFRESH" });
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json({ message: "Logout successful" });
}

export const googleAuthController = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
        return res.status(401).json({ message: "No token provided" });
        }
        const decoded = await admin.auth().verifyIdToken(token);

        const { email, name, uid, picture } = decoded;

        let user = await UserModel.findOne({ email });

        if (!user) {
            user = await UserModel.create({
                name,
                email,
                googleUid: uid,
                profileImage: picture,
                provider: "google",
                verifiedByGoogle: true,
                isEmailVerified: true,
            });

            await sendEmail({
                sendTo: user.email,
                subject: "Welcome to Project Management",
                html: welcomeEmailTemplate(user.name),
            })
            const { accessToken, refreshToken } = await generateTokens(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // true only on HTTPS
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 30,}
            );
            return res.json({ success: true, message: "Login successful", user, accessToken, setPassword: true });
        }

        if (!user.hashedPassword || user.hashedPassword === "" || user.hashedPassword === null) {
            const setPassword = true;
            const { accessToken, refreshToken } = await generateTokens(user);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 30,}
            );

            await sendEmail({
                sendTo: user.email,
                subject: "Welcome to Project Management",
                html: welcomeEmailTemplate(user.name),
            })
            return res.json({ success: true, message: "Login successful", user, accessToken, setPassword });
        }

        await sendEmail({
            sendTo: user.email,
            subject: "Welcome to Project Management",
            html: welcomeEmailTemplate(user.name),
        })
        const { accessToken, refreshToken} = await generateTokens(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24 * 30,}
        );
        return res.json({ success: true, message: "Login successful", user, accessToken });
    } catch (err) {
        console.error("Firebase verify failed:", err?.message || err);
        return res.status(401).json({ message: "Invalid Google token" });
    }
};

export const setPasswordController = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password too short" });
        }

        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user.hashedPassword = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password set successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Password update failed" });
    }
};
