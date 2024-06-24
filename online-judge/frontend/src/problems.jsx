import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Problems() {
    const [problems, setProblems] = useState([]);

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
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <Link to='/create_problem' className='btn btn-success mb-2'>Add +</Link>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Problem Title</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem) => (
                            <tr key={problem._id}>
                                <td>{problem.problem_title}</td>
                                <td>
                                    <Link to={`/update_problem/${problem._id}`} className='btn btn-success'>Update</Link>
                                    <button className='btn btn-danger' onClick={(e) => handleDelete(problem._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Problems;
