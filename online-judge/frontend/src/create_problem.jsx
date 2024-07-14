import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'; // Import Dropdown if you use Dropdown.Item

function Create_Problems() {

    const initialTestCase = {
        input: "",
        output: "",
    }

    const [problem_title, set_problem_title] = useState('');
    const [problem_statement, set_problem_statement] = useState('');
    const [sample_input, set_sample_input] = useState('');
    const [sample_output, set_sample_output] = useState('');
    const [test_cases, set_test_cases] = useState([initialTestCase]);
    const [difficulty, setDifficulty] = useState('');
    const [difficultyTitle, setDifficultyTitle] = useState('Set Difficulty')
    const [selected_tags, set_Selected_tags] = useState([]);
    const tags = ['Array', 'DP', 'Greedy', 'Pointers', 'Basic Maths'];

    const toogleTags = (option) => {
        if (selected_tags.includes(option)) {
            set_Selected_tags(selected_tags.filter((item) => item !== option));
        } else {
            set_Selected_tags([...selected_tags, option]);
        }
    };

    const navigate = useNavigate();

    const handleInputChange = (index, event) => {
        const values = [...test_cases];
        values[index][event.target.name] = event.target.value;
        set_test_cases(values);
    };

    const Submit = async (e) => {
        e.preventDefault();
        const formatted_tags = selected_tags.map(tag => ({ tag }));
        try {
            // await axios.post("http://localhost:8000/create_problem", { problem_title, problem_statement, sample_input, sample_output, test_cases, difficulty, selected_tags: formatted_tags });
            await axios.post(`${process.env.REACT_APP_BACKEND}/create_problem`, { problem_title, problem_statement, sample_input, sample_output, test_cases, difficulty, selected_tags: formatted_tags });
            console.log("Added successfully");
            navigate('/problem');
        } catch (error) {
            console.log("Error adding data : " + error);
        }
    }

    const addTestCase = () => {
        set_test_cases([...test_cases, { ...initialTestCase }]);
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3" style={{ height: '90%', overflowY: 'auto' }}>
                <form onSubmit={Submit}>
                    <h2>Add Problem</h2>
                    <div className="mb-2">
                        <label htmlFor="">Problem Title</label>
                        <input type="text" placeholder="Enter Problem Title" className="form-control" value={problem_title} onChange={(e) => set_problem_title(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Problem Statement</label>
                        <textarea placeholder="Enter Problem Statement" className="form-control" rows="3" value={problem_statement} onChange={(e) => set_problem_statement(e.target.value)}></textarea>
                    </div>
                    <DropdownButton id="dropdown-basic-button" title={difficultyTitle}>
                        <Dropdown.Item onClick={() => { setDifficulty("Easy"); setDifficultyTitle("Easy"); }}>Easy</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setDifficulty("Medium"); setDifficultyTitle("Medium"); }}>Medium</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setDifficulty("Hard"); setDifficultyTitle("Hard"); }}>Hard</Dropdown.Item>
                    </DropdownButton>
                    <div>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Options
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {tags.map((option, index) => (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => toogleTags(option)}
                                        active={selected_tags.includes(option)}
                                    >
                                        {option}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <div>
                            <strong>Selected Options:</strong>
                            {selected_tags.join(', ')}
                        </div>
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
                        <button type="submit" className="btn btn-success">Submit</button>
                        <button type="button" className="btn btn-primary" onClick={addTestCase}>Add hidden test cases</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Create_Problems;
