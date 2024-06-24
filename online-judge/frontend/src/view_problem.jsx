import React from "react";

function View_Problem() {
    return (
        <div className="container-fluid vh-100 bg-secondary justify-content-center align-items-center">
            <div className="row">
                <div className="col">
                    <h1>This is the problem Title</h1>
                </div>
                <div className="col d-flex justify-content-center align-items-center">
                    <select className="form-control w-auto">
                        <option value='cpp'>C++</option>
                        <option value='c'>C</option>
                        <option value='py'>Python</option>
                        <option value='java'>Java</option>
                    </select>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <h2>This is the problem statement</h2>
                </div>
                <div className="col">
                    <textarea className="form-control w-100" rows="20" placeholder="Enter your code here"></textarea>
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col">
                    
                </div>
                <div className="col">
                    <button>Run</button>
                    <button>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default View_Problem;
