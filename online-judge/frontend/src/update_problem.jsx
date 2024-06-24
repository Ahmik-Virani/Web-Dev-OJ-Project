import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Update_Problems() {
    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');

    const navigate = useNavigate();

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form>
                    <h2>Update Problem</h2>
                    <div className="mb-2">
                        <label htmlFor="problem_title">Problem Title</label>
                        <input type="text" placeholder="Enter Problem Title" className="form-control" value={problem_title} onChange={(e) => set_problem_title(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="problem_statement">Problem Statement</label>
                        <input type="text" placeholder="Enter Problem Statement" className="form-control" value={problem_statement} onChange={(e) => set_problem_statement(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="sample_input">Test Case Input</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Test Case Input" value={sample_input} onChange={(e) => set_sample_input(e.target.value)}></textarea>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="sample_output">Test Case Output</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Test Case Output" value={sample_output} onChange={(e) => set_sample_output(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">Update</button>
                </form>
            </div>
        </div>
    );
}

export default Update_Problems;
