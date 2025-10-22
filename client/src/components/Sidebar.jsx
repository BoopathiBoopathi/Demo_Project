import React from 'react'
export default function Sidebar({ annotations, text }) {
    return (
        <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">Annotations ({annotations.length})</h3>
            <div className="space-y-2 max-h-[70vh] overflow-auto">
                {annotations.map(a => (
                    <div key={a._id} className="p-2 border rounded">
                        <div className="text-xs text-gray-500">{a._id}</div>
                        <div className="text-sm">"{text.slice(a.start, a.end)}"</div>
                        <div className="text-xs text-gray-600">{a.comment || '—'}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
