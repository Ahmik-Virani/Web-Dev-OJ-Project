import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Create_Problems() {
    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');

    const navigate = useNavigate();

    const Submit = (e) => {
        e.preventDefault();
        try {
            axios.post("http://localhost:8000/createProblem", { problem_title, problem_statement, sample_input, sample_output });
            console.log("Added successfully");
            navigate('/problem');
        } catch (error) {
            console.log("Error adding data : " + error);
        }
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={Submit}>
                    <h2>Add Problem</h2>
                    <div className="mb-2">
                        <label htmlFor="">Problem Title</label>
                        <input type="text" placeholder="Enter Problem Title" className="form-control" onChange={(e) => set_problem_title(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Problem Statement</label>
                        <input type="text" placeholder="Enter Problem Statement" className="form-control" onChange={(e) => set_problem_statement(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Test Case Input</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Test Case Input" onChange={(e) => set_sample_input(e.target.value)}></textarea>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Test Case Output</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Test Case Output" onChange={(e) => set_sample_output(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Create_Problems;
