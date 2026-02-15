import axios from "axios";
import { useState } from "react";
import api from "../api/axios";

export const useCloudinaryUpload = () => {
    const [progress, setProgress] = useState({});
    const [uploading, setUploading] = useState(false);

    const uploadFiles = async (files, folder = "project-gallery", retry = 2) => {
        setUploading(true);
        const { data } = await api.get(`/api/upload/signature?folder=${folder}`);

        const uploads = files.map((file, index) => {
            return new Promise(async (resolve, reject) => {
                let attempts = 0;
                const upload = async () => {
                    try {
                        attempts++;

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("api_key", data.apiKey);
                        formData.append("timestamp", data.timestamp);
                        formData.append("signature", data.signature);
                        formData.append("folder", data.folder);

                        const res = await axios.post(
                            `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
                            formData,
                            {
                                onUploadProgress: (e) => {
                                const percent = Math.round((e.loaded * 100) / e.total);
                                setProgress((prev) => ({ ...prev, [index]: percent }));
                                },
                            }
                        );

                        resolve({
                            url: res.data.secure_url,
                            publicId: res.data.public_id,
                        });
                    } catch (err) {
                        if (attempts <= retry) return upload();
                        reject(err);
                    }
                };

                upload();
            });
        });

        const results = await Promise.all(uploads);
        setUploading(false);

        return results;
    };

    return { uploadFiles, progress, uploading };
};