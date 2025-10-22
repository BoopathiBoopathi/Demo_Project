import { useEffect, useState } from "react";
import axios from "axios";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";

export default function Home({ onView }) {
    const [docs, setDocs] = useState([]);

    const fetchDocs = async () => {
        const res = await axios.get("http://localhost:4000/api/docs");
        setDocs(res.data);
    };

    const handleUploaded = () => fetchDocs();

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this document?")) return;
        await axios.delete(`http://localhost:4000/api/docs/${id}`);
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
