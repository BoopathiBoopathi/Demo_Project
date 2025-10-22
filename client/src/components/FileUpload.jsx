import React, { useState } from "react";
import axios from "axios";

export default function FileUpload({ onUpload }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:4000/api/docs/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onUpload(res.data); // pass uploaded doc info to parent
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="bg-white p-6 shadow-md rounded-xl w-96 text-center">
                <h2 className="text-lg font-bold mb-4">📄 Upload Document</h2>
                <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 w-full mb-3 rounded"
                />
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
}
