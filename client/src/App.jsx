// import { useState } from "react";
// import Home from "./pages/Home";
// import DocumentViewer from "./components/DocumentViewer";

// export default function App() {
//     const [selectedDoc, setSelectedDoc] = useState(null);

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {!selectedDoc ? (
//                 <Home onView={(doc) => setSelectedDoc(doc)} />
//             ) : (
//                 <div className="p-6">
//                     <button
//                         onClick={() => setSelectedDoc(null)}
//                         className="mb-4 text-blue-600 hover:underline"
//                     >
//                         ← Back to Documents
//                     </button>
//                     <DocumentViewer doc={selectedDoc} />
//                 </div>
//             )}
//         </div>
//     );
// }



import React, { Component } from "react";
import Home from "./pages/Home";
import DocumentViewer from "./components/DocumentViewer";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6">
                    <h1 className="text-red-600 text-xl font-bold mb-4">Something went wrong.</h1>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo?.componentStack}
                    </details>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDoc: null,
        };
    }

    setSelectedDoc = (doc) => {
        this.setState({ selectedDoc: doc });
    };

    render() {
        const { selectedDoc } = this.state;

        return (
            <div className="min-h-screen bg-gray-100">
                <ErrorBoundary>
                    {!selectedDoc ? (
                        <Home onView={this.setSelectedDoc} />
                    ) : (
                        <div className="p-6">
                            <button
                                onClick={() => this.setSelectedDoc(null)}
                                className="mb-4 text-blue-600 hover:underline"
                            >
                                ← Back to Documents
                            </button>
                            <DocumentViewer doc={selectedDoc} />
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        );
    }
}

export default App;
