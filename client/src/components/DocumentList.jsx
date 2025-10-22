export default function DocumentList({ docs, onView, onDelete }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Document List</h2>
            <table className="min-w-full text-left border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">S.No</th>
                        <th className="px-4 py-2 border">File Name</th>
                        <th className="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {docs.map((doc, i) => (
                        <tr key={doc._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{i + 1}</td>
                            <td className="px-4 py-2 border">{doc.title}</td>
                            <td className="px-4 py-2 border">
                                <button
                                    onClick={() => onView(doc)}
                                    className="text-blue-600 hover:underline mr-3"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => onDelete(doc._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {docs.length === 0 && (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-gray-500">
                                No documents found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
