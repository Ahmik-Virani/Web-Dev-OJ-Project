import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Update_Problems() {
    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const result = await axios.get(`http://localhost:8000/get_problem/${id}`);
                set_problem_title(result.data.problem_title);
                set_problem_statement(result.data.problem_statement);
                set_sample_input(result.data.sample_input);
                set_sample_output(result.data.sample_output);
            } catch (error) {
                console.log("Error fetching problem: " + error);
            }
        };

        fetchProblem();
    }, [id]);

    const Update = (e) => {
        e.preventDefault();
        try {
            axios.put("http://localhost:8000/update_problem/"+id, { problem_title, problem_statement, sample_input, sample_output });
            console.log("Added successfully");
            navigate('/problem');
        } catch (error) {
            console.log("Error adding data : " + error);
        }
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={Update}>
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
