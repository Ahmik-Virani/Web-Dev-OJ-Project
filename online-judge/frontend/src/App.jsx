import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './index.css';
import user_icon from './assets/person.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';

function App() {
  const [action, setAction] = useState("Login");
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if ((action === "Sign Up" && firstname && lastname && userEmail && userPassword) || (action === "Login" && userEmail && userPassword)) {
      const data = {
        firstname,
        lastname,
        email: userEmail,
        password: userPassword,
      };

      try {
        setLoading(true);
        const response = await uploadUserData(data);
        console.log(response);
        setLoading(false);
        toast.success('Action successful!');
        navigate('/home');
      } catch (error) {
        console.error("Error uploading user data:", error);
        toast.error(error.message || 'An error occurred.');
        setLoading(false);
      }
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  const uploadUserData = async (data) => {
    let url = 'http://localhost:8000/login';
    if (action === "Sign Up") {
      url = 'http://localhost:8000/register';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    return response.json();
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">

                <div className="mb-md-5 mt-md-4 pb-5">

                  <h2 className="fw-bold mb-2 text-uppercase">{action}</h2>
                  <p className="text-white-50 mb-5">
                    {action === "Login" ? "Please enter your login and password!" : "Please fill out the form to sign up!"}
                  </p>

                  {action === "Sign Up" && (
                    <>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          id="typeFirstnameX"
                          className="form-control form-control-lg"
                          placeholder="First Name"
                          value={firstname}
                          onChange={(e) => setFirstname(e.target.value)}
                        />
                      </div>
                      <div className="form-outline form-white mb-4">
                        <input
                          type="text"
                          id="typeLastnameX"
                          className="form-control form-control-lg"
                          placeholder="Last Name"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      placeholder="Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <a className="text-white-50" href="#!">Forgot password?</a>
                  </p>

                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>

                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                    <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                  </div>

                </div>

                <div>
                  <p className="mb-0">
                    {action === "Login" ? "Don't have an account?" : "Already have an account?"}
                    <a
                      href="#!"
                      className="text-white-50 fw-bold"
                      onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
                    >
                      {action === "Login" ? " Sign Up" : " Login"}
                    </a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
}

export default App;
