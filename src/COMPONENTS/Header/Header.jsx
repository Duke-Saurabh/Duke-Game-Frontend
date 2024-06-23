import React, { useContext, useEffect, useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../userContext/UserContext';

function Header() {
  const [isLogined, setIsLogined] = useState(false);
  const { user, setUser }= useContext(UserContext);
  const [logout,setLogout]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogined(user?true:false);
  }, [user]);


  const handleLogout = async () => {
  
    const dataObj = {
      email: user?.email || '',
      userName: user?.userName || '',
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataObj)
    };

    try {
      const response = await fetch('/api/v1/users/logout', options);
      if (response.ok) {
        // Clear tokens from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Clear user context
        setUser(null);
        setLogout(false);
        navigate(`/login`); // Redirect to login page
      } else {
        const errorData = await response.json();
        alert(`Logout failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <div className='header'>
       {logout && (
        <div className="logout-panel">
          <div className="logout-box">
            <p>Do you want to logout?</p>
            <div className="logout-options">
              <button type="button" onClick={handleLogout}>Yes</button>
              <button type="button" onClick={() => setLogout(false)}>No</button>
            </div>
          </div>
        </div>
      )}
      {!isLogined && (
        <>
          <Link to='/'>SignUp</Link>
          <Link to='/login'>SignIn</Link>
        </>
      )}
      <Link to='/about'>About Us</Link>
      {isLogined && (
        <button type='button' onClick={()=>setLogout(prev=>!prev)}>Log Out</button>
      )}
    </div>
  );
}

export default Header;
