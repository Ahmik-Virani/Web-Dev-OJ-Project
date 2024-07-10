import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './index.css';

function Problems() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const result = await axios.get('http://localhost:8000/problem');
                setProblems(result.data);
            } catch (error) {
                console.error('Error fetching problems: ', error);
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

    const handleDifficultyChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedDifficulty([...selectedDifficulty, value]);
        } else {
            const updatedDifficulty = selectedDifficulty.filter(difficulty => difficulty !== value);
            setSelectedDifficulty(updatedDifficulty);
        }
    };

    const handleTagChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedTags([...selectedTags, value]);
        } else {
            const updatedTags = selectedTags.filter(tag => tag !== value);
            setSelectedTags(updatedTags);
        }
    };

    const tags = ['Array', 'DP', 'Greedy', 'Pointers', 'Basic Maths'];

    const filteredProblems = problems.filter(problem => {
        const matchesSearchTerm = problem.problem_title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = selectedDifficulty.length === 0 || selectedDifficulty.includes(problem.difficulty);
        const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => problem.selected_tags.map(t => t.tag).includes(tag));
        return matchesSearchTerm && matchesDifficulty && matchesTags;
    });

    return (
        <div className="container">
            <h1 className="mt-4 mb-4">Problems</h1>
            {user?.role === 'admin' && (
                <Link to="/create_problem" className="btn btn-success mb-2">Add +</Link>
            )}
            <input
                type="text"
                placeholder="Search by problem name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />
            <div className="mb-3">
                <h5>Filter by Difficulty:</h5>
                <div className="form-check form-check-inline">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="difficultyEasy"
                        value="Easy"
                        checked={selectedDifficulty.includes('Easy')}
                        onChange={handleDifficultyChange}
                    />
                    <label className="form-check-label" htmlFor="difficultyEasy">Easy</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="difficultyMedium"
                        value="Medium"
                        checked={selectedDifficulty.includes('Medium')}
                        onChange={handleDifficultyChange}
                    />
                    <label className="form-check-label" htmlFor="difficultyMedium">Medium</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="difficultyHard"
                        value="Hard"
                        checked={selectedDifficulty.includes('Hard')}
                        onChange={handleDifficultyChange}
                    />
                    <label className="form-check-label" htmlFor="difficultyHard">Hard</label>
                </div>
            </div>
            <div className="mb-3">
                <h5>Filter by Tags:</h5>
                {tags.map(tag => (
                    <div key={tag} className="form-check form-check-inline">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`tag${tag}`}
                            value={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={handleTagChange}
                        />
                        <label className="form-check-label" htmlFor={`tag${tag}`}>{tag}</label>
                    </div>
                ))}
            </div>
            <div>
                {filteredProblems.map(problem => (
                    <div key={problem._id} className="d-flex mb-2">
                        <div className="problem-box w-100" onClick={() => navigate(`/view_problem/${problem._id}`)}>
                            <div className="problem-title">{problem.problem_title}</div>
                            {problem.difficulty && (
                                <div className={`problem-difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</div>
                            )}
                            <div className="problem-tags">
                                {problem.selected_tags.map(tag => (
                                    <span key={tag._id} className="tag">{tag.tag}</span>
                                ))}
                            </div>
                        </div>
                        {user?.role === 'admin' && (
                            <div className="ml-2">
                                <Link to={`/update_problem/${problem._id}`} className="btn btn-success mr-2">Update</Link>
                                <button className="btn btn-danger" onClick={() => handleDelete(problem._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Problems;
