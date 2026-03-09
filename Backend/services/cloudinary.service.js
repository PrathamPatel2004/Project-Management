import cloudinary from "../config/cloudinaryConfig.js"

export const generateUploadSignature = ({ folder }) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder },
        process.env.CLOUDINARY_API_SECRET
    )

    return {
        timestamp,
        signature,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder
    };
}

export const deleteImages = async (publicIds = []) => {
    if (!publicIds.length) return;

    await cloudinary.api.delete_resources(publicIds);
};