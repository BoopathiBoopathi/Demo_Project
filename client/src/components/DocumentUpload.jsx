import { useState } from "react";
import axios from "axios";

export default function DocumentUpload({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file first");
        const formData = new FormData();
        formData.append("file", file);
        try {
            setLoading(true);
            const API_BASE_URL = import.meta.env.VITE_SERVER;

            const res = await axios.post(`${API_BASE_URL}/api/docs/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onUploaded(res.data);
            setFile(null);
        } catch (err) {
            alert("Upload failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-end items-center mb-4 space-x-2">
            <input
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="border rounded px-2 py-1"
            />
            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </div>
    );
}
