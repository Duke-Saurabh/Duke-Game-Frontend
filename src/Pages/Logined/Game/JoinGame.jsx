import React, { useEffect, useState } from 'react';
import './JoinGame.css';
import { useNavigate } from 'react-router-dom';

function JoinGame() {
  const [isCreateTeam, setIsCreateTeam] = useState(false);
  const [teamDetails, setTeamDetails] = useState({
    teamName: '',
    firstPlayer: '',
    secondPlayer: '',
    thirdPlayer: '',
    fourthPlayer: ''
  });
  const [createdTeam, setCreatedTeam] = useState('');
  const [teamSelected, setTeamSelected] = useState('');
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState(1);
  const navigate = useNavigate();

  const handleSetTeams = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    };

    try {
      const response = await fetch('/api/v1/users/team', options);

      if (response.ok) {
        const responseData = await response.json();
        setTeams(responseData.data);
      } else {
        const errorData = await response.json();
        alert(`Team fetching failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during fetching teams detail.');
    }
  };

  useEffect(() => {
    handleSetTeams();
  }, [createdTeam]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeamDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleCreateTeam = async () => {
    const { teamName, firstPlayer, secondPlayer, thirdPlayer, fourthPlayer } = teamDetails;

    const dataobj = {
      teamName,
      firstPlayerUserName: firstPlayer,
      secondPlayerUserName: secondPlayer,
      thirdPlayerUserName: thirdPlayer,
      fourthPlayerUserName: fourthPlayer
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataobj)
    };

    try {
      const response = await fetch('/api/v1/users/createTeam', options);
      if (response.ok) {
        const responseData = await response.json();
        setCreatedTeam(responseData.data);
        setTeamDetails({
          teamName: '',
          firstPlayer: '',
          secondPlayer: '',
          thirdPlayer: '',
          fourthPlayer: ''
        });
        setIsCreateTeam(false);
      } else {
        const errorData = await response.json();
        alert(`Team creation failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during team creation.');
    }
  };

  const handleJoinGame = () => {
    if(teamSelected==''){
      alert('Select a Team First');
    }else{
      navigate('/play', { state: { teamSelected, rounds } });
    }
  };

  return (
    <div className='join-game'>
      <div className='game'>
        <h1 className='main-head'>Welcome to Raja Mantri Chor Sipahi</h1>
        <button type='button' className='teamBtn' onClick={() => { setIsCreateTeam(prev => !prev) }}>
          {isCreateTeam ? 'Cancel' : 'Create a Team'}
        </button>

        {isCreateTeam && (
          <div>
            <h2>Create Team!</h2>
            <div className='team-create'>
              <input
                name='teamName'
                value={teamDetails.teamName}
                onChange={handleInputChange}
                placeholder='Enter The Team Name'
              />
              <input
                name='firstPlayer'
                value={teamDetails.firstPlayer}
                onChange={handleInputChange}
                placeholder="Enter The First Player's Name"
              />
              <input
                name='secondPlayer'
                value={teamDetails.secondPlayer}
                onChange={handleInputChange}
                placeholder="Enter The Second Player's Name"
              />
              <input
                name='thirdPlayer'
                value={teamDetails.thirdPlayer}
                onChange={handleInputChange}
                placeholder="Enter The Third Player's Name"
              />
              <input
                name='fourthPlayer'
                value={teamDetails.fourthPlayer}
                onChange={handleInputChange}
                placeholder="Enter The Fourth Player's Name"
              />
              <button onClick={handleCreateTeam}>Create a Team</button>
            </div>
          </div>
        )}

        <div className='team-join'>
          <h1>Enter Team Name</h1>
          <select value={teamSelected} onChange={(e) => { setTeamSelected(e.target.value); }}>
            <option value='' disabled>Select a team</option>
            {teams.map((team, index) => (
              <option key={index} value={team.teamName}>{team.teamName}</option>
            ))}
          </select>
          <input
            placeholder='Enter Number of rounds'
            type='number'
            min={1}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
          />
          <button type='button' onClick={handleJoinGame}>Join Game</button>
        </div>
      </div>
    </div>
  )
}

export default JoinGame;
