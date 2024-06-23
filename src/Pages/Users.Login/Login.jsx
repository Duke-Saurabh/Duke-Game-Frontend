import React, { useState,useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { UserContext } from '../../userContext/UserContext';

function Login() {
  const [userName,setUserName]=useState('');
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');

  const navigate=useNavigate();

  const { setUser } = useContext(UserContext);

  const handleLogin=async (e)=>{
    e.preventDefault();

  
    if (!email || !userName || !password || [email, userName, password].some(field => field.trim() === '')) {
      alert('All fields are required');
      return;
    }
  
    const dataObj = {
      email,
      userName,
      password:password
    };
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataObj)
    };
  
    try {
      const response = await fetch('/api/v1/users/login', options);
  
      if (response.ok) {
        const responseData = await response.json();
        const { accessToken, refreshToken,user } = responseData;
  
        // Store the tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
  
        // // Store the tokens in cookies
        // document.cookie = `accessToken=${accessToken}; path=/; secure; HttpOnly`;
        // document.cookie = `refreshToken=${refreshToken}; path=/; secure; HttpOnly`;
  
        alert('Login successful!');
        setUser(user);
  
        navigate('/game');
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login. Please try again.');
    }
  }

  return (
    <div className='login'>
        <div className='login-area'>
            <div className='head'><h3>LOGIN ACCOUNT</h3></div>
            {/* <input placeholder='Enter your name'></input> */}
            <input placeholder='Enter your username' value={userName} onChange={(e)=>{setUserName(e.target.value)}}></input>
            <input placeholder='Enter your email' value={email} onChange={(e)=>{setemail(e.target.value)}}></input>
            <input placeholder='Password' type='password' value={password} onChange={(e)=>{setpassword(e.target.value)}}></input>
            {/* <input placeholder='Repeat Password' type='password'></input> */}

            <button type='button' onClick={handleLogin}>LOGIN</button>
            <div className='signup-section'>
                <p>Have already an account?<Link to='/'>SIGNUP Here</Link></p>
            </div>
        </div>
    </div>
  )
}

export default Login