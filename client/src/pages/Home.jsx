import { useEffect, useState } from "react";
import axios from "axios";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";

export default function Home({ onView }) {
    const [docs, setDocs] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_SERVER;
    const fetchDocs = async () => {
        const res = await axios.get(`${API_BASE_URL}/api/docs`);
        setDocs(res.data);
    };

    const handleUploaded = () => fetchDocs();

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document?")) return;
        await axios.delete(`${API_BASE_URL}/api/docs/${id}`);
        fetchDocs();
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    return (
        <div className="p-6">
            <DocumentUpload onUploaded={handleUploaded} />
            <DocumentList docs={docs} onView={onView} onDelete={handleDelete} />
        </div>
    );
}
