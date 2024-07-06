import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import logo from './assets/logo.png';
import './index.css';
import { useUser } from './UserContext';

function App() {
  const [action, setAction] = useState("Login");
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const checkPassword = (pwd) => {
    const decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,100}$/;
    if (pwd.match(decimal)) {
      return true;
    } else {
      alert('Password must be at least 8 characters long and must contain at least one lowercase, one uppercase, one special character, and one numeric digit');
      return false;
    }
  };

  const handleSubmit = async () => {
    if ((action === "Sign Up" && firstname && lastname && userEmail && userPassword) || (action === "Login" && userEmail && userPassword)) {
      if (action === 'Login' || checkPassword(userPassword)) {
        const data = {
          firstname,
          lastname,
          email: userEmail,
          password: userPassword,
        };

        try {
          setLoading(true);
          const response = await uploadUserData(data);
          setLoading(false);
          toast.success('Action successful!');
          setUser(response.existingUser || response.user); // Ensure to handle response appropriately
          navigate('/home');
        } catch (error) {
          console.error("Error uploading user data:", error);
          toast.error(error.message || 'An error occurred.');
          setLoading(false);
        }
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
      body: JSON.stringify(data),
      credentials: 'include',     //Only added this line to fix the cookies part
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${errorText}`);
    }

    return response.json();
  };

  return (
    <section className="vh-100 gradient-custom " style={{ overflow: "auto", height: "100%" }}>
      <div className="container py-5 h-auto">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-light text-black">
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <img src={logo} style={{ width: '100px' }} alt="logo" />
                  <h2 className="fw-bold mb-2 text-uppercase">{action}</h2>
                  <p className="text-black-50 mb-5">
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
                  <div className="form-outline form-white mb-4" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={visible ? "text" : "password"}
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      placeholder="Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      style={{ paddingRight: '40px' }} // Ensure there's space for the icon inside the input
                    />
                    <div
                      onClick={() => setVisible(!visible)}
                      style={{ position: 'absolute', right: '10px', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
                    >
                      {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </div>
                  </div>

                  <p className="small mb-5 pb-lg-2">
                    <a className="text-black-50" href="#!">Forgot password?</a>
                  </p>

                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-outline-light btn-lg px-5 bg-primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    {action === "Login" ? "Don't have an account?" : "Already have an account?"}
                    <a
                      href="#!"
                      className="text-blue-50 fw-bold"
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
