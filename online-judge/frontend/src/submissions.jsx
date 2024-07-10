import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';

function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccessOnly, setShowSuccessOnly] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null); // State to hold selected submission

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = await localStorage.getItem('token');
                const result = await axios.get('http://localhost:8000/submissions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSubmissions(result.data);
            } catch (error) {
                console.error("Error fetching submissions: ", error);
            }
        };

        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
        .filter(submission => {
            const matchesSearchTerm = submission.problem_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSuccessFilter = showSuccessOnly ? submission.verdict === 'Success' : true; // Check for 'Success' verdict
            return matchesSearchTerm && matchesSuccessFilter;
        });

    // Function to handle showing code in a modal
    const showCodeModal = (submission) => {
        setSelectedSubmission(submission);
        // Open modal to display code
    };

    // Function to close the modal
    const closeCodeModal = () => {
        setSelectedSubmission(null);
        // Close modal
    };

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">Submissions</h1>
            <input
                type="text"
                placeholder="Search by problem name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />
            <div className="form-check mb-3">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="successFilter"
                    checked={showSuccessOnly}
                    onChange={(e) => setShowSuccessOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="successFilter">Show only accepted submissions</label>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Problem Name</th>
                        <th>Date and Time</th>
                        <th>Verdict</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubmissions.map(submission => (
                        <tr key={submission._id}>
                            <td>{submission.problem_name}</td>
                            <td>{new Date(submission.date).toLocaleString()}</td>
                            <td>{submission.verdict}</td>
                            <td>
                                {/* Use onClick to show the code in a modal */}
                                <button onClick={() => showCodeModal(submission)} className="btn btn-primary btn-sm">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for displaying code */}
            {selectedSubmission && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedSubmission.problem_name}</h5>
                                <button type="button" className="close" onClick={closeCodeModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Editor
                                    height="400px"
                                    language="cpp"
                                    theme="vs-light"
                                    value={selectedSubmission.code}
                                    options={{
                                        readOnly: true,
                                        wordWrap: "off", // Disable word wrapping to enable horizontal scrolling
                                        scrollBeyondLastLine: false,
                                        minimap: { enabled: false },
                                        padding: { top: 0, bottom: 0 },
                                    }}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeCodeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Submissions;
