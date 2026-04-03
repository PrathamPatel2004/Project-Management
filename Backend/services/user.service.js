import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import UserTokenModel from '../models/userToken.model.js';

export const findUserByEmail = async (email) => {
    const user = await UserModel.findOne({ email });
    return user;
}

export const createUser = async ({ name, email, password, image }) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = password ? await bcryptjs.hash(password, salt) : null;

    const user = await UserModel.create({
        name,
        email,
        hashedPassword,
        image,
        provider: password ? 'local' : 'google',
        verifiedByGoogle: !password,
        isEmailVerified: !password
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken  = crypto.createHash('sha256').update(rawToken).digest('hex');
    const userToken = await UserTokenModel.create({ userId: user._id, token: hashedToken , type: 'VERIFY', expiresAt: new Date(Date.now() + 60 * 15 * 1000) });

    return { user, rawToken };
}

export const verifyUser = async (verificationToken) => {

    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const userToken = await UserTokenModel.findOne({ token: hashedToken, type: 'VERIFY' });

    if (!userToken) throw new Error("Invalid token");

    const user = await UserModel.findByIdAndUpdate(userToken.userId, { isEmailVerified: true }, { new: true });
    await userToken.deleteOne();

    return user;
}

export const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY_ACCESS_TOKEN, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY_REFRESH_TOKEN, { expiresIn: '30d' });

    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await UserTokenModel.create({
        userId: user._id,
        token: hashedRefreshToken,
        type: "REFRESH",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return { accessToken, refreshToken };
}

export const matchPassword = async ({ user, password }) => {
    if (!user.hashedPassword) return res.status(400).json({ message: "User Password not set, Please set password or login with google login" });

    const isMatch = await bcryptjs.compare(password, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    return isMatch;
}