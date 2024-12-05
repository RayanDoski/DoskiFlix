import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/login.css';
// import Loading from '../Loading/loading.js';

function Login() {
  
  const [show, setShow] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    // Ensure email and password are provided
    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json(); // Parse JSON response
  
      if (response.ok && data.success) {
        setErrorMessage(''); // Clear any previous errors
        alert(data.message); // Display success message
        window.location.href = '/profile'; // Redirect to profile page
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred while logging in. Please try again.');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!firstname || !lastname || !email || !password) {
      setErrorMessage('All fields are required');
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });

    const data = await response.json();
    if (data.success) {
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
      setShowLogin(true); // Switch back to login form after successful registration
    } else {
      setErrorMessage(data.message);
    }
  };

  return (
    <>
      <section className={ show ? 'Login show' : 'Login' }>
        
          { showLogin ? (
            <form onSubmit={handleLogin}>
              <h3 onClick={() => setShow(false)}>&#215;</h3>
              <h2>Welcome Back</h2>
              <p>{errorMessage}</p>
              <div>
                <label htmlFor="Email">Email:</label>
                <input type="email" id="Email" name="Email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type='submit'>Login</button>
              <aside>
                <Link className='createAccount' onClick={() => setShowLogin(false)}>Create Account</Link>
              </aside>
            </form>  
          ) : (
            <form onSubmit={handleRegister}>
              <h3 onClick={() => setShow(false)}>&#215;</h3>
              <h2>Welcome To Doskiflix</h2>
              <div>
                <label htmlFor="firstname">Firstname:</label>
                <input type="text" id="firstname" name="firstname" onChange={(e) => setFirstname(e.target.value)} />
              </div>
              <div>
                <label htmlFor="lastname">Lastname:</label>
                <input type="text" id="lastname" name="lastname" onChange={(e) => setLastname(e.target.value)} />
              </div>
              <div>
                <label htmlFor="Email">Email:</label>
                <input type="email" id="Email" name="Email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type='submit'>Create Account</button>
              <aside>
                <Link className='createAccount' onClick={() => setShowLogin(true)}>Login</Link>
              </aside>
            </form>
          ) }

      </section>  
    </>
  );
}

export default Login;