import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import './index.css'

function Problems() {
    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const result = await axios.get('http://localhost:8000/problem');
                setProblems(result.data);
            } catch (error) {
                console.log("Error Updating: " + error);
            }
        };

        fetchProblems();
    }, []);

    const handleDelete = (id) => {
        try {
            axios.delete('http://localhost:8000/delete_problem/' + id);
            window.location.reload();
        } catch (error) {
            console.log("Error deleting problem : " + error);
        }
    };

    return (
        <div>
            <div className="d-flex vh-100 bg-light">
                <div className="w-100 bg-white rounded p-3">
                    {user?.role === 'admin' && (
                        <Link to='/create_problem' className='btn btn-success mb-2'>Add +</Link>
                    )}
                    <input type="text" placeholder="Search here..." className="mb-3 form-control" onChange={(e) => { setSearchTerm(e.target.value) }} />
                    {problems
                        .filter((problem) => {
                            if (searchTerm == "") {
                                return problem;
                            } else if (problem.problem_title.toLowerCase().includes(searchTerm.toLocaleLowerCase())) {
                                return problem;
                            }
                        })
                        .map((problem) => (
                            <div key={problem._id} className="d-flex mb-2">
                                <div className="problem-box w-100" onClick={() => navigate(`/view_problem/${problem._id}`)}>
                                    <div className="problem-title">
                                        {problem.problem_title}
                                    </div>

                                    {problem.difficulty === 'Easy' && (
                                        <div className="problem-difficulty-easy">
                                            {problem.difficulty}
                                        </div>
                                    )}
                                    {problem.difficulty === 'Medium' && (
                                        <div className="problem-difficulty-medium">
                                            {problem.difficulty}
                                        </div>
                                    )}
                                    {problem.difficulty === 'Hard' && (
                                        <div className="problem-difficulty-hard">
                                            {problem.difficulty}
                                        </div>
                                    )}

                                    <div className="problem-tags">
                                        {problem.selected_tags.map(tag => (
                                            <span key={tag._id} className="tag">{tag.tag}</span>
                                        ))}
                                    </div>
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="ml-2">
                                        <Link to={`/update_problem/${problem._id}`} className='btn btn-success'>Update</Link>
                                        <button className='btn btn-danger' onClick={(e) => handleDelete(problem._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Problems;