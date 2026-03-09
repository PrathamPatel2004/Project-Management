import { generateUploadSignature, deleteImages } from "../services/cloudinary.service.js";

export const getUploadSignature = async (req, res) => {
    const { folder = "project-gallery" } = req.query;

    const data = generateUploadSignature({ folder });
    res.json(data);
}

export const cleanupImages = async (req, res) => {
    const { publicIds } = req.body;

    if (!Array.isArray(publicIds)) {
        return res.status(400).json({ message: "publicIds must be an array" });
    }

    await deleteImages(publicIds);
    res.json({ success: true });
};
