import React from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../userContext/UserContext';

function LogoutBtn() {
  const [logout, setLogout] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  
  return (
    <div>
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
    </div>
  )
}

export default LogoutBtn