import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
function Login() {
  const [name,setname]=useState('');
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');

  const navigate=useNavigate();

  const handleLogin=()=>{
          navigate('/game');
  }

  return (
    <div className='login'>
        <div className='login-area'>
            <div className='head'><h3>LOGIN ACCOUNT</h3></div>
            {/* <input placeholder='Enter your name'></input> */}
            <input placeholder='Enter your username' value={name} onChange={(e)=>{setname(e.target.value)}}></input>
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