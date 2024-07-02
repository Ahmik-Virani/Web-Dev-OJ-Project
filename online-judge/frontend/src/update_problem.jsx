import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Update_Problems() {
    const initialTestCase = {
        input: "",
        output: "",
    }

    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');
    const [test_cases, set_test_cases] = useState([initialTestCase]);

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
                set_test_cases(result.data.test_cases || [initialTestCase]);
            } catch (error) {
                console.log("Error fetching problem: " + error);
            }
        };

        fetchProblem();
    }, [id]);

    const handleInputChange = (index, event) => {
        const values = [...test_cases];
        values[index][event.target.name] = event.target.value;
        set_test_cases(values);
    };
    
    const Update = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/update_problem/${id}`, { problem_title, problem_statement, sample_input, sample_output, test_cases });
            console.log("Updated successfully:", response.data);
            navigate('/problem');
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                console.error("Error response:", error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error message:", error.message);
            }
        }
    }
    
    

    const addTestCase = () => {
        set_test_cases([...test_cases, { ...initialTestCase }]);
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3" style={{ height: '90%', overflowY: 'auto' }}>
                <form onSubmit={Update}>
                    <h2>Update Problem</h2>
                    <div className="mb-2">
                        <label htmlFor="">Problem Title</label>
                        <input type="text" placeholder="Enter Problem Title" className="form-control" value={problem_title} onChange={(e) => set_problem_title(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Problem Statement</label>
                        <textarea placeholder="Enter Problem Statement" className="form-control" rows="3" value={problem_statement} onChange={(e) => set_problem_statement(e.target.value)}></textarea>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Sample Input</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Sample Input" value={sample_input} onChange={(e) => set_sample_input(e.target.value)}></textarea>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Sample Output</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Sample Output" value={sample_output} onChange={(e) => set_sample_output(e.target.value)}></textarea>
                    </div>
                    {test_cases.map((test_case, index) => (
                        <div key={index} className="mb-2">
                            <h4>Hidden Test Case {index + 1}</h4>
                            <div className="mb-2">
                                <label>Test Case Input</label>
                                <textarea
                                    name="input"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Test Case Input"
                                    value={test_case.input}
                                    onChange={(e) => handleInputChange(index, e)}
                                ></textarea>
                            </div>
                            <div className="mb-2">
                                <label>Test Case Output</label>
                                <textarea
                                    name="output"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Test Case Output"
                                    value={test_case.output}
                                    onChange={(e) => handleInputChange(index, e)}
                                ></textarea>
                            </div>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success">Update</button>
                        <button type="button" className="btn btn-primary" onClick={addTestCase}>Add hidden test cases</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update_Problems;
