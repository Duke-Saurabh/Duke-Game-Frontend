import React, { useEffect, useState } from 'react'
import './Register.css';
import { Link } from 'react-router-dom';

function Register() {
    const [name,setname]=useState('');
    const [userName,setuserName]=useState('');
    const [email,setemail]=useState('');
    const [password,setpassword]=useState('');
    const [repeatPassword,setrepeatPassword]=useState('');
    const [confirmPasswordNotes, setConfirmPasswordNotes] = useState('');

    useEffect((event)=>{
      const passwordSubstring=password.slice(0,repeatPassword.length);
      if(repeatPassword.length>0){
        if (repeatPassword === passwordSubstring) {
            if (password.length === repeatPassword.length) {
              setConfirmPasswordNotes('Your Password Matched');
            } else {
              setConfirmPasswordNotes('Your Password is Matching Proceed Further');
            }
          }
         else {
            setConfirmPasswordNotes('Your Password is <strong>NOT MATCHING</strong>. Recorrect it.');
          }
      }else{
        setConfirmPasswordNotes('');
      }
    },[repeatPassword,password]);

   return (

    <div className='register'>
        <div className='register-area'>
            <div className='head'><h3>CREATE ACCOUNT</h3></div>
            <input placeholder='Enter your name' value={name} onChange={(e)=>{setname(e.target.value)}}></input>
            <input placeholder='Enter your username' value={userName} onChange={(e)=>{setuserName(e.target.value)}}></input>
            <input placeholder='Enter your email' value={email} onChange={(e)=>{setemail(e.target.value)}}></input>
            <input placeholder='Password' type='password' value={password} onChange={(e)=>{setpassword(e.target.value)}}></input>
            <input placeholder='Repeat Password' type='password' value={repeatPassword} onChange={(e)=>{setrepeatPassword(e.target.value)}}></input>
            <p dangerouslySetInnerHTML={{ __html: confirmPasswordNotes }}></p>

            <button>SIGN UP</button>
            <div className='login-section'>
                <p>Have already an account?<Link to='/login'>Login Here</Link></p>
            </div>
        </div>
    </div>
  )
}

export default Register