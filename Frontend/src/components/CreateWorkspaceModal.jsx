import { useEffect, useState, useRef } from "react"
import CloseIcon from "@mui/icons-material/Close"
import toast from "react-hot-toast"
import api from "../api/axios"
import { useDispatch } from "react-redux"
import { addWorkspace } from "../features/workspaceSlice"

const CreateWorkspaceModal = ({ onClose }) => {

    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [logoFile, setLogoFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)

    const fileRef = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        const newSlug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        setSlug(newSlug)
    }, [name])

    useEffect(() => {
        const handler = (e) => e.key === "Escape" && onClose()
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image must be under 10MB")
            return
        }

        setLogoFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("Organization name is required")
            return
        }

        if (!slug.trim()) {
            toast.error("Slug is required")
            return
        }

        try {
            setLoading(true)

            const formData = new FormData()
            formData.append("name", name)
            formData.append("slug", slug)
            if (logoFile) formData.append("logo", logoFile)

            const { data } = await api.post(
                "workspace/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            )

            dispatch(addWorkspace(data))
            toast.success("Organization created successfully")
            onClose()

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create organization")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-xl shadow-lg p-6 relative">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-black dark:hover:text-white"
                >
                    <CloseIcon fontSize="small" />
                </button>

                <h2 className="text-lg font-semibold mb-4">Create Organization</h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => fileRef.current.click()}
                            className="w-16 h-16 rounded-lg border overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center dark:bg-neutral-800"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs text-gray-400">Logo</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <button
                                type="button"
                                onClick={() => fileRef.current.click()}
                                className="px-3 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                            >
                                Upload
                            </button>
                            <p className="text-xs text-gray-400 mt-1">
                                Recommended size 1:1, up to 10MB
                            </p>
                        </div>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleFileChange}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Organization"
                            className="w-full border border-gray-300 dark:border-neutral-700 rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Slug</label>
                        <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="organization-name"
                            className="w-full border border-gray-300 dark:border-neutral-700 rounded px-3 py-2 mt-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* <p className="text-xs text-gray-400 mt-1">
                            Used in URLs: yourapp.com/{slug || "organization"}
                        </p> */}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateWorkspaceModal;
