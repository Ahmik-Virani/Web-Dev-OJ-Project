import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';

function View_Problem() {

    const initialTestCase = {
        input: "",
        output: "",
    }

    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');
    const [test_cases, set_test_cases] = useState([initialTestCase]);
    const [verdict, set_verdict] = useState('');

    const [code, setCode] = useState(`#include <iostream> 
using namespace std;
      
int main() { 
    cout << "Hello World!"; 
            
    return 0; 
}`);
    const [output, setOutput] = useState(''); // State to store output
    const [input, setInput] = useState('');

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
                set_test_cases(result.data.test_cases);

            } catch (error) {
                console.log("Error fetching problem: " + error);
            }
        };

        fetchProblem();
    }, [id]);

    const handleRun = async () => {
        // Reset output state to clear previous output
        setOutput('');

        const payload = {
            language: 'cpp',
            code,
            input
        };

        try {
            const { data } = await axios.post('http://localhost:8000/run', payload);
            setOutput(data.output); // Update output state with fetched data
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleSubmit = async () => {
        // Reset output state to clear previous output
        setOutput('');
        set_verdict('');

        const outputArray = [];

        for (let i = 0; i < test_cases.length; i++) {
            const payload = {
                language: 'cpp',
                code,
                input: test_cases[i].input,
            };

            try {
                const { data } = await axios.post('http://localhost:8000/run', payload);
                outputArray.push(data.output);
            } catch (error) {
                console.log(error.response);
            }
        }

        let verdict = "Success";

        for (let i = 0; i < test_cases.length; i++) {
            let actualOutput = outputArray[i].replace(/\s+/g, ' ').trim();
            let expectedOutput = test_cases[i].output.replace(/\s+/g, ' ').trim();

            if (actualOutput !== expectedOutput) {
                verdict = "Wrong answer in test case " + (i + 1);
                break;
            }
        }


        set_verdict(verdict);

        // Submit the solution to backend
        const submissionPayload = {
            problem_name: problem_title,
            verdict,
            code,
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/submit_solution', submissionPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Solution submitted successfully");

        } catch (error) {
            console.log("Error submitting solution: ", error.response);
        }
    }

    return (
        <div className="container-fluid vh-100 bg-light" style={{ overflow: "auto", height: "100%" }}>
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
                            <pre>{problem_statement}</pre>

                            <h3>Sample Input</h3>
                            <textarea
                                className="form-control mb-3"
                                value={sample_input}
                                readOnly
                                style={{
                                    fontSize: 12,
                                    outline: 'none',
                                    border: '1px solid #ced4da', // Adding border style
                                    borderRadius: '4px', // Adding border radius
                                    padding: '8px', // Adding padding
                                    overflowY: 'hidden', // Hide overflow to make it auto-adjust
                                }}
                            />

                            <h3>Sample Output</h3>
                            <textarea
                                className="form-control mb-3"
                                value={sample_output}
                                readOnly
                                style={{
                                    fontSize: 12,
                                    outline: 'none',
                                    border: '1px solid #ced4da', // Adding border style
                                    borderRadius: '4px', // Adding border radius
                                    padding: '8px', // Adding padding
                                    overflowY: 'hidden', // Hide overflow to make it auto-adjust
                                }}
                            />
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

                            <div className="container mt-4">
                                <div className="bg-light shadow-md w-100 mb-4" style={{ maxWidth: '600px', height: '300px', overflowY: 'auto' }}>
                                    <Editor
                                        height="300px"
                                        language="cpp"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        options={{
                                            automaticLayout: true,
                                            wordWrap: "off",
                                            scrollBeyondLastLine: false,
                                            minimap: { enabled: false },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="container mt-4">
                                <textarea
                                    className="form-control mb-3"
                                    placeholder="Enter sample input here"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    style={{
                                        fontSize: 12,
                                        rows: '5',
                                        outline: 'none',
                                        border: '1px solid #ced4da', // Adding border style
                                        borderRadius: '4px', // Adding border radius
                                        padding: '8px', // Adding padding
                                        height: '200px', // Increasing height slightly
                                        overflowY: 'auto',
                                    }}
                                />

                                <textarea
                                    className="form-control"
                                    placeholder="Sample output will display here"
                                    value={output} // Bind output state here
                                    readOnly // Make it read-only
                                    style={{
                                        fontSize: 12,
                                        outline: 'none',
                                        border: '1px solid #ced4da', // Adding border style
                                        borderRadius: '4px', // Adding border radius
                                        padding: '8px', // Adding padding
                                        height: '200px', // Increasing height slightly
                                        overflowY: 'auto',
                                    }}
                                />
                            </div>

                            {verdict && (
                                <div className="mt-4 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h3>Verdict</h3>
                                            <p>{verdict}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-end mt-4">
                                <button className="btn btn-success mr-2" onClick={handleRun}>Run</button>
                                <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
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
