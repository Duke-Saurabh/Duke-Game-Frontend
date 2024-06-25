import React, { useState, useEffect, useRef, useContext } from 'react';
import './PlayGame.css';
import { UserContext } from '../../../userContext/UserContext';
import socket from '../../../socket';
import { useLocation } from 'react-router-dom';

function PlayGame() {
    const [openChat, setOpenChat] = useState(window.innerWidth > 920); // Initial state based on window width
    const chatAreaRef = useRef(null); // Ref to the chat area DOM element
     
    const { user, setUser }= useContext(UserContext);
    const location = useLocation();
    const { teamSelected, rounds } = location.state || {}; 

    const [teamMates, setTeamMates] = useState({});
    const [playersJoined,setPlayersJoined]=useState([]);

    const [messToSend,setMessToSend]=useState({});
    const [recievedMessages,setRecievedMessages]=useState([]);

    const [importantNotes,setImportantNotes]=useState('Start Game');

    useEffect(() => {
      const fetchTeamMates = async () => {
        const dataObj = {
          teamSelected // Assuming teamSelected is defined somewhere in your component
        };
  
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataObj)
        };
  
        try {
          const response = await fetch('/api/v1/users/teamMates', options);
  
          if (!response.ok) {
            throw new Error('Some errors in fetching teamMates');
          }
  
          const responseData = await response.json();
  
          const {
            firstPlayerUserName,
            secondPlayerUserName,
            thirdPlayerUserName,
            fourthPlayerUserName
          } = responseData.data;
  
          setTeamMates({
            firstPlayerUserName,
            secondPlayerUserName,
            thirdPlayerUserName,
            fourthPlayerUserName
          });
  
        } catch (error) {
          console.error('Error fetching teamMates:', error.message);
          // Handle errors as needed
        }
      };
  
      fetchTeamMates();
    }, [teamSelected]); 
  
    useEffect(() => {
        console.log(teamMates); 
      }, [teamMates]); 
    
    useEffect(()=>{
        socket.on('connect', () => {
         console.log('Connected to server');
        });
        socket.on('disconnect', () => {
         console.log('Disconnected from server');

        });
        return () => {
        socket.off('connect');
        socket.off('disconnect');
        };
    })  
    
    const handleLeaveGame = async () => {
      const dataObj = {
        teamSelected ,
        userName:user.userName
      };
  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataObj)
      };
  
      try {
        const response = await fetch('/api/v1/users/teamMates/game/leave', options);
  
        if (!response.ok) {
          throw new Error('Some errors in fetching teamMates');
        }
  
        const responseData = await response.json();
        alert('You left the match');
      } catch (error) {
        console.error('Error in Leaving the Game', error.message);
      }
    };
  
    useEffect(() => {
      socket.emit('joinGame', { ...user, teamSelected, rounds });
  
      // Cleanup function to handle leaving the game
      return () => {
        socket.off('joinGame');  
        handleLeaveGame();
        console.log('handleLeaveEnvetCalled');
      };
    }, []);

    useEffect(()=>{
        const teamEvent = `/${teamSelected}`;
        socket.on(teamEvent, (players) => {
            const mappedPlayers = players.map(player => ({ name: player.name, score: '0' }));
            setPlayersJoined(mappedPlayers);
        });
        console.log(teamEvent);
        return()=>{
            socket.off(teamEvent);   
        }
    },[teamSelected])


  console.log(playersJoined);

    useEffect(()=>{
      socket.emit( `/message`,{teamSelected,messToSend}); 
      // console.log({teamSelected,messToSend});
    },[teamSelected,messToSend])

    useEffect(()=>{
      socket.on( `/${teamSelected}/message`,(mess)=>{
        console.log(mess);
        setRecievedMessages((prev)=>([...prev,mess.userName?(mess):({userName:'Sender',content:'Message'})]))
        
      })

      return()=>{
        socket.off(`/${teamSelected}/message`);
      }
    },[teamSelected])


    const sendMessRef=useRef(null);
    const handleMessSend=()=>{
      // console.log(sendMessRef.current.value);
      setMessToSend({userName:user.userName,content:sendMessRef.current.value});
      // console.log(messToSend);
      sendMessRef.current.value='';
    }
    
   



    //.....................other........................//
    const handleClickOutSideChatArea=()=>{
        if(window.innerWidth < 920)
        setOpenChat(false);
    }

   
    // Style object for the chat area
    const mystYle = {
        display: openChat ? 'block' : 'none', // Show or hide chat area based on openChat state
        width: '320px', // Fixed width for the chat area (can be adjusted)
    //    height:'auto'
    };

    const mystYleOpenChatBtn={
        // display:
    }

    
    return (
        <div className='container'>
            <div className='welcome-note'><h2>Welcome {user?.userName || ''} to Raja Mantri Chor Sipahi</h2></div>
            <div style={mystYleOpenChatBtn} className='open-chat' onClick={() => setOpenChat(prev => !prev)}>Chat</div>
            <div className='game-area' onClick={handleClickOutSideChatArea} >
                {/* Game area content */}
                <div className='importantNotes'>{importantNotes}</div>
                <div className='game-show-area'>
                    <div className='player one'>
                        <p className='player-name'>{teamMates?.firstPlayerUserName || 'Player 1'}</p>
                        <p className='player-score'>Score: 10</p>
                    </div>
                    <div className='player two'>
                        <p className='player-name'>{teamMates?.secondPlayerUserName || 'Player 2'}</p>
                        <p className='player-score'>Score: 8</p>
                    </div>
                    <div className='score'>
                            <p>Team : {teamSelected}</p>
                        {
                          playersJoined.map((player, index) => (
                          <p key={index}>
                           {player?.name || ''}: {((player && player?.score == 0 ) ? 'joined' : player.score) || ''}
                          </p>
                          ))
                        }
                        {
                            playersJoined.length<4
                            &&
                            (
                                <p>Waiting for Other's to Join</p>
                            )
                        }
                    </div>

                    <div className='player three'>
                        <p className='player-name'>{teamMates?.thirdPlayerUserName || 'Player 3'}</p>
                        <p className='player-score'>Score: 15</p>
                    </div>
                    <div className='player four'>
                        <p className='player-name'>{teamMates?.fourthPlayerUserName || 'Player 4'}</p>
                        <p className='player-score'>Score: 5</p>
                    </div>
                </div>
                <button className='sufflebtn'>Card Suffle</button>
                <div className='divider'></div>
                <div className='shuffle-area'>
                    <div className='card one'>Card 1</div>
                    <div className='card two'>Card 2</div>
                    <div className='card three'>Card 3</div>
                    <div className='card four'>Card 4</div>
                </div>
            </div>
            {/* Chat area with conditional style */}
            <div className='chat-area' ref={chatAreaRef} style={mystYle}>
                <div className='sent-chats'>
                {
                  recievedMessages.map((mess,index)=>(
                    mess && (
                    <div className='message' key={index}>
                      <div className='mess-sender'>{mess?.userName}:</div>
                      <div className='mess-body'>{mess.content}</div>
                    </div>
                    )
                  ))
                }
                </div>
                <input className='chat' placeholder='My message' ref={sendMessRef}></input>
                <button type='button' className='sendBtn' onClick={handleMessSend}>Send</button>
            </div>
        </div>
    );
}

export default PlayGame;
