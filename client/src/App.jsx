import { useState } from "react";
import Home from "./pages/Home";
import DocumentViewer from "./components/DocumentViewer";

export default function App() {
    const [selectedDoc, setSelectedDoc] = useState(null);

    return (
        <div className="min-h-screen bg-gray-100">
            {!selectedDoc ? (
                <Home onView={(doc) => setSelectedDoc(doc)} />
            ) : (
                <div className="p-6">
                    <button
                        onClick={() => setSelectedDoc(null)}
                        className="mb-4 text-blue-600 hover:underline"
                    >
                        ← Back to Documents
                    </button>
                    <DocumentViewer doc={selectedDoc} />
                </div>
            )}
        </div>
    );
}
