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

    const [cards,setCards]=useState([
        {role:'Raja',score:1000},{role:'Mantri',score:800},{role:'Sipahi',score:500},{role:'Chor',score:0}
    ])

    const [scores,setScores]=useState({});
    const [playerIdx,setPlayerIdx]=useState(0);
    const [isSuffled,setIsSuffled]=useState(false);

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

    //..................................................//

    useEffect(()=>{
      if(playersJoined.length!=4 ){
        setImportantNotes(`Waiting for Others to join.`)
        return;
      }

      if(isSuffled==false){
        setImportantNotes(`${playersJoined?.[0]?.name} Press the Card Suffle Button`)
        return;
      }

      if(playerIdx==0){
        setImportantNotes(`${playersJoined?.[0]?.name} Choose a Card`)
        return;
      }

      if(playerIdx==1){
        setImportantNotes(`${playersJoined?.[1]?.name} Choose a Card`)
        return;
      }

      if(playerIdx==2){
        setImportantNotes(`${playersJoined?.[2]?.name} Choose a Card`)
        return;
      }

      if(playerIdx==3){
        setImportantNotes(`${playersJoined?.[3]?.name} Choose a Card`)
        return;
      }

      if(playerIdx==4){
        setImportantNotes(`Raja: "Raja Raj Karta Hai Sipahi Chor Ko Pakdo".`);

        
      }

      


      return;
    },[playersJoined,playerIdx,isSuffled]);

   
    // Style object for the chat area
    const mystYle = {
        display: openChat ? 'block' : 'none', // Show or hide chat area based on openChat state
        width: '320px', // Fixed width for the chat area (can be adjusted)
    //    height:'auto'
    };
    
    console.log('cards:',cards);
    const handleCardSuffle=()=>{
      const cardDetails=[...cards];
      for(let i=0;i<4;i++){
        const j=Math.floor(Math.random()*(4));
        [cardDetails[i],cardDetails[j]]=[cardDetails[j],cardDetails[i]];
      }
      socket.emit('/suffle',{team:teamSelected,card:[...cardDetails],suffle:true})
      console.log('cards:',cards);
    }

    const cardRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const handleCardClick = (index) => {
      console.log('card clicked: ', index);

      if (playersJoined?.[playerIdx]?.name !== user?.userName || isSuffled === false) {
        return;
      }
    
      const { role, score } = cards[index];
      console.log('role:', role);
      console.log('score:', score);
    
      let newScore, newRole;
    
      switch (role) {
        case 'Raja':
          newScore = score;
          newRole = role;
          break;
        case 'Sipahi':
          newScore = 'Wait till End';
          newRole = role;
          break;
        case 'Mantri':
        case 'Chor':
          newScore = 'Hidden';
          newRole = 'Hidden';
          break;
        default:
          return;
      }
    
      // setScores((prev) => ({
      //   ...prev,
      //   [playersJoined[playerIdx].name]: { score: newScore, role: newRole },
      // }));
    
      for(let i=0;i<4;i++){
        cardRefs[i].current.style.display = 'none';
      }
      socket.emit(`/cardSelect`, { index, playerIndex:playerIdx, team: teamSelected, score:{...scores,
        [playersJoined[playerIdx].name]: { score: newScore, role: newRole },
      }});

      return () => {
        socket.off(`/${teamSelected}/playerIdx`, handlePlayerIdxUpdate);
      };
    };


    const handleCardSelectUpdate = ({playerIndex,index,score}) => {
      cardRefs[index].current.style.display = 'none';
      setPlayerIdx(playerIndex+1);
      setScores({...score});
    };

    const handleCardShuffleUpdate = ({ card, suffle }) => {
      for (let i = 0; i < 4; i++) {
        if (cardRefs[i]?.current?.style) {
          cardRefs[i].current.style.display = 'flex';
        }
      }
      setCards([...card]);
      console.log(card);
      setIsSuffled(suffle);
    };    


    useEffect(()=>{

      socket.on(`/${teamSelected}/cardSelect`, handleCardSelectUpdate);
      socket.on(`/${teamSelected}/suffle`,handleCardShuffleUpdate)
    
      return () => {
        socket.off(`/${teamSelected}/cardSelect`, handleCardSelectUpdate);
        socket.on(`/${teamSelected}/suffle`,handleCardShuffleUpdate)
      };

    })


    

    console.log('check:', (!isSuffled && playersJoined.length===4 && playersJoined?.[0].name===user.userName) )
    
    return (
        <div className='container'>
            <div className='welcome-note'><h2>Welcome {user?.userName || ''} to Raja Mantri Chor Sipahi</h2></div>
            <div className='open-chat' onClick={() => setOpenChat(prev => !prev)}>Chat</div>
            <div className='game-area' onClick={handleClickOutSideChatArea} >
                {/* Game area content */}
                <div className='importantNotes'>{importantNotes}</div>
                <div className='game-show-area'>
                    <div className='player one'>
                        <p className='player-name'>{teamMates?.firstPlayerUserName || 'Player 1'}</p>
                        <p className='player-role'>Role: {scores[teamMates?.firstPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.firstPlayerUserName]?.score || 'none'}</p>
                    </div>
                    <div className='player two'>
                        <p className='player-name'>{teamMates?.secondPlayerUserName || 'Player 2'}</p>
                        <p className='player-role'>Role: {scores[teamMates?.secondPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.secondPlayerUserName]?.score || 'none'}</p>
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
                        <p className='player-role'>Role: {scores[teamMates?.thirdPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.thirdPlayerUserName]?.score || 'none'}</p>
                    </div>
                    <div className='player four'>
                        <p className='player-name'>{teamMates?.fourthPlayerUserName || 'Player 4'}</p>
                        <p className='player-role'>Role: {scores[teamMates?.fourthPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.fourthPlayerUserName]?.score || 'none'}</p>
                    </div>
                </div>
                {
                  !isSuffled && playersJoined.length===4 && playersJoined?.[0].name===user.userName &&
                   (
                   <button className='shufflebtn' type='button' onClick={handleCardSuffle}>
                   Card Shuffle
                   </button>
                   )
                }

                
                {/* <div className='divider'></div> */}
                <div className='shuffle-area'>
                    <div className='card one' ref={cardRefs[0]} onClick={()=>handleCardClick(0)}>Card 1</div>
                    <div className='card two' ref={cardRefs[1]} onClick={()=>handleCardClick(1)}>Card 2</div>
                    <div className='card three' ref={cardRefs[2]} onClick={()=>handleCardClick(2)}>Card 3</div>
                    <div className='card four' ref={cardRefs[3]} onClick={()=>handleCardClick(3)}>Card 4</div>
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
