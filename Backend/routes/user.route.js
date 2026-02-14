import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { signup, verifyEmailLink, login, refreshAccessToken, logoutController, googleAuthController, setPasswordController, verifyAccessToken } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/signup-verification", verifyEmailLink);
userRouter.post("/verify", auth, verifyAccessToken)
userRouter.post("/login", login);
userRouter.get("/refresh", refreshAccessToken);
userRouter.post("/logout", logoutController);
userRouter.post("/google", googleAuthController);
userRouter.put("/set-password", auth, setPasswordController);

export default userRouter;