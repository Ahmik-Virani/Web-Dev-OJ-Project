import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './index.css';
import user_icon from './assets/person.png';
import email_icon from './assets/email.png';
import password_icon from './assets/password.png';
import { useState } from 'react';

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
        navigate('/home'); // Redirect to /home
      } catch (error) {
        console.error("Error uploading user data:", error);
        toast.error(error.message || 'An error occurred.'); // Display error message
        setLoading(false);
      }
    } else {
      toast.error("Please fill out all fields."); // Display error message for missing fields
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
    <div className='container'>
      <Toaster /> {/* Add Toaster component here */}
      <div className='header'>
        <div className='text'>{action}</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>
        {action === "Login" ? null : (
          <>
            <div className='input'>
              <img src={user_icon} alt='user icon' />
              <input 
                type='text' 
                placeholder='First Name' 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)} 
              />
            </div>
            <div className='input'>
              <img src={user_icon} alt='user icon' />
              <input 
                type='text' 
                placeholder='Last Name' 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)} 
              />
            </div>
          </>
        )}
        <div className='input'>
          <img src={email_icon} alt='email icon' />
          <input 
            type='email' 
            placeholder='Email Id' 
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)} 
          />
        </div>
        <div className='input'>
          <img src={password_icon} alt='password icon' />
          <input 
            type='password' 
            placeholder='Password' 
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)} 
          />
        </div>
      </div>
      <div className="submit-container">
        <div className="submit-button" onClick={handleSubmit}>
          {loading ? "Submitting..." : "Submit"}
        </div>
      </div>
      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
      </div>
    </div>
  )
}

export default App;
