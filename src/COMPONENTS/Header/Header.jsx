import React from 'react'
import './Header.css';
import { Link } from 'react-router-dom';

let isLogined=true;

function Header() {
  return (
    <div className='header'>
        <Link to='/'>SignUp</Link>
        <Link to='/login'>SignIn</Link>
        <Link>About Us</Link>
        {
            isLogined && (
                <Link>Logout</Link>
            )
        }
    </div>
  )
}

export default Header