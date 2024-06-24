import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function View_Problem() {
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
    
    return (
        <div className="container-fluid vh-100 bg-light">
            <div className="row">
                <div className="col">
                    <h1 className="text-center mt-4 mb-4">{problem_title}</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h3>Problem Statement</h3>
                            <p>{problem_statement}</p>

                            <h3>Sample Input</h3>
                            <p>{sample_input}</p>

                            <h3>Sample Output</h3>
                            <p>{sample_output}</p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <select className="form-control mb-3">
                                <option value='cpp'>C++</option>
                                <option value='c'>C</option>
                                <option value='py'>Python</option>
                                <option value='java'>Java</option>
                            </select>

                            <textarea className="form-control mb-3" rows="15" placeholder="Enter your code here"></textarea>

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-primary mr-2">Run</button>
                                <button className="btn btn-success">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <Link to="/problem" className="btn btn-secondary">Go Back</Link>
                </div>
            </div>
        </div>
    );
}

export default View_Problem;
