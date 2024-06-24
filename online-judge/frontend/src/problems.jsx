import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Problems() {
    const [problems, setProblems] = useState([{
        problem_title: "add 2 numbers"
    }]);

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
                            <tr>
                                <td>{problem.problem_title}</td>
                                <td>
                                    <Link to='/update_problem' className='btn btn-success'>Update</Link>
                                    <button className='btn btn-danger'>Delete</button>
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
