import { Router } from "express";
import { getUploadSignature, cleanupImages } from "../controllers/upload.controller.js";
import auth from "../middleware/auth.middleware.js";

const uploadRouter = Router();

uploadRouter.get("/signature", auth, getUploadSignature);
uploadRouter.post("/cleanup", auth, cleanupImages);

export default uploadRouter;