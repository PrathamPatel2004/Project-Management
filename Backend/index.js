import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connnectDB.js";
import userRouter from "./routes/user.route.js";
import workspaceRouter from "./routes/workspace.route.js";
import uploadRouter from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send({ message: "Backend is running on port " + PORT });
})

app.use('/api/auth', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/workspace', workspaceRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    })
});