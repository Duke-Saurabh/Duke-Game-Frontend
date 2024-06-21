import React, { useState } from 'react'
import './JoinGame.css';
import { useNavigate } from 'react-router-dom';

function JoinGame() {
    const [createTeam,setcreateTeam]=useState(false);
    const navigate=useNavigate();

    const handleJoinGame=()=>{
        navigate('/play');
    }
  return (
    <div className='join-game'>
         <h1 className='main-head'>Welcome to Raja Mantri Chor Sipahi</h1>
         <div className='game'>
          
          <button type='button' className='teamBtn' onClick={()=>{setcreateTeam((prev)=>!prev)}}>Create a Team</button>

         {
            createTeam && 

            (<div>
                <h2>Create Team!</h2>
                <div className='team-create'>
                  <input placeholder='Enter The Team Name'></input>
                  <input placeholder="Enter The First Player's Name"></input>
                  <input placeholder="Enter The Second Player's Name"></input>
                  <input placeholder="Enter The Third Player's Name"></input>
                  <input placeholder="Enter The Fourth Player's Name"></input>
                  <button>Create a Team</button>
                </div>
            </div>
            )
         }
         <div className='team-join'>
             
             <h1>Enter Team Name</h1>
             <input placeholder="Enter Team Name"></input>
             <button type='button' onClick={handleJoinGame}>Join Game</button>

         </div>
         </div>
    </div>
  )
}

export default JoinGame