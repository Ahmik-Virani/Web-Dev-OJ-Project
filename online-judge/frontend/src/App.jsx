import './index.css'
import user_icon from './assets/person.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'
import { useState } from 'react'
import { uploadUserData } from './services/api'

function App() {

  const [action, setAction] = useState("Login");
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = async () => {
    if ((action === "Sign Up" && firstname && lastname && userEmail && userPassword) || (action === "Login" && userEmail && userPassword)) {
      const data = new FormData();
      if (action === "Sign Up") {
        data.append('firstname', firstname);
        data.append('lastname', lastname);
      }
      data.append('email', userEmail);
      data.append('password', userPassword);

      try {
        const response = await uploadUserData(data);
        console.log(response);
      } catch (error) {
        console.error("Error uploading user data:", error);
      }
    } else {
      console.log("Please fill out all fields.");
    }
  };

  return (
    <div className='container'>
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
        <div className="submit-button" onClick={handleSubmit}>Submit</div>
      </div>
      <div className="submit-container">
        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>Sign Up</div>
        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => setAction("Login")}>Login</div>
      </div>
    </div>
  )
}

export default App
