import { useState, useEffect, useRef } from "react";
import axios from "axios";


export default function DocumentViewer({ doc }) {
    const [annotations, setAnnotations] = useState([]);
    const [selectedRange, setSelectedRange] = useState(null);
    const contentRef = useRef();

    const getDoc = async () => {
        const API_BASE_URL = import.meta.env.VITE_SERVER;
        axios.get(`${API_BASE_URL}/api/docs/${doc._id}/annotations`)
            .then((res) => setAnnotations(res.data))
            .catch(console.error);
    }
    useEffect(() => {
        getDoc(doc._id)
    }, [doc._id]);

    const handleTextSelect = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (!text) return;

        const range = selection.getRangeAt(0);
        const start = range.startOffset;
        const end = range.endOffset;

        const comment = prompt(`Add comment for "${text}"`);
        if (!comment) return;

        const payload = { start, end, comment, userId: "demoUser" };
        const API_BASE_URL = import.meta.env.VITE_SERVER;
        const url = `${API_BASE_URL}/api/docs/${doc._id}/annotations`
        axios.post(url, payload)
            .then((res) => setAnnotations((prev) => [...prev, res.data]))
            .catch((err) => {
                if (err.response?.status === 409) alert("Duplicate annotation!");
                else alert("Error saving annotation");
            });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <div
                ref={contentRef}
                onMouseUp={handleTextSelect}
                className="bg-white p-4 rounded-lg shadow-md w-full md:w-3/4 overflow-y-auto border border-gray-200"
                style={{ whiteSpace: "pre-wrap" }}
            >
                {doc.extractedText}
            </div>

            <div className="w-full md:w-1/4 bg-gray-50 p-4 border rounded-lg overflow-y-auto max-h-[80vh]">
                <h3 className="text-lg font-semibold mb-2">Annotations</h3>
                {annotations.map((a) => (
                    <div key={a._id} className="border-b py-2">
                        <p className="text-blue-600 font-semibold">Range: {a.start}-{a.end}</p>
                        <p className="text-gray-700 text-sm">{a.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
