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

    const [chorSipahi, setChorSipahi] = useState({Chor:'',Sipahi:''});

    const [scores,setScores]=useState({});
    const [playerIdx,setPlayerIdx]=useState(0);
    const [isSuffled,setIsSuffled]=useState(false);

    console.log('chorSipahi: ',chorSipahi)
    useEffect(() => {
      
      // setChorSipahi(prev =>
      //   {
      //     console.log('prev:',prev);
      //     return { ...prev, Chor: user?.userName }
      //   });
      // setChorSipahi(prev => ({ ...prev, Sipahi: user?.userName }));

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
            const mappedPlayers = players.map(player => ({ name: player.name, score: player.score || 0 }));
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
        return; 
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
      for (let i = 0; i < 4; i++) {
          cardRefs[i].current.style.display = 'none';
      }
      if (role === 'Chor') {
          setChorSipahi((prev) => ({ ...prev, Chor: user?.userName }))
      } else if (role === 'Sipahi') {
          setChorSipahi((prev) => ({ ...prev, Sipahi: user?.userName }))
      }
      socket.emit(`/cardSelect`, {
          chorSipahi: {
              Chor: role === 'Chor' ? user?.userName : chorSipahi.Chor,
              Sipahi: role === 'Sipahi' ? user?.userName : chorSipahi.Sipahi
          },
          index, playerIndex: playerIdx, team: teamSelected, score: {
              ...scores,
              [playersJoined[playerIdx].name]: { name: playersJoined[playerIdx].name, score: newScore, role: newRole, realRole:role }
          }
      });
  }

    const handlePlayerClick=(player)=>{
      console.log('handlePlayerClick');
      if(playerIdx!=4){
        return;
      }

      if (scores?.[user?.userName]?.realRole!=='Sipahi' || isSuffled === false) {
        return;
      }

      const role=scores?.[player]?.realRole;
      console.log('player:',player);
      console.log('player role:',role);

      if(role==='Raja' || role==='Sipahi'){
        setImportantNotes('This Player Card could not be selected. Choose other one.');
        return;
      }

      const suffle=false;
      const playerIndex=0; 
      const team=teamSelected;
      let MantriPlayer='';
      for(let key in scores){
        const {realRole}=scores[key];
        if(realRole==='Mantri'){
          MantriPlayer=key;
        }
      }
      if(role==='Mantri'){
        const score= {
             ...scores,
            [chorSipahi?.Chor]: { name:chorSipahi?.Chor, score: 500, role: 'Chor', realRole: 'Chor' },
            [chorSipahi?.Sipahi]: { name:chorSipahi?.Sipahi, score: 0, role: 'Sipahi', realRole: 'Sipahi' },
            [player]: { name:player, score: 800, role: 'Mantri', realRole: 'Mantri' },
        };
        console.log('new score:',score);    
      
        socket.emit('/playerSelected',{playerIndex,team,score,suffle});
      }

      if(role==='Chor'){
        const score= {
             ...scores,
            [chorSipahi?.Chor]: { score: 0, role: 'Chor', realRole: 'Chor' },
            [chorSipahi?.Sipahi]: { score: 500, role: 'Sipahi', realRole: 'Sipahi' },
            [MantriPlayer]: { name:MantriPlayer, score: 800, role: 'Mantri', realRole: 'Mantri' },
        };
        console.log('new score:',score);   
        console.log('sent player select socket',playerIndex,team,score,suffle); 
        socket.emit('/playerSelected',{playerIndex,team,score,suffle});
      }

    
    }

    console.log('playerIdx:',(scores?.[user?.userName]?.realRole))
    const handleCardSelectUpdate = ({ index, playerIndex, team, score, chorSipahi }) => {
      cardRefs[index].current.style.display = 'none';
      setPlayerIdx(playerIndex+1);
      setScores({...score});
      setChorSipahi(chorSipahi);
      console.log('socket ChorSipahi: ', chorSipahi)
    };

    const handleCardShuffleUpdate = ({ card, suffle }) => {
      for (let i = 0; i < 4; i++) {
        if (cardRefs[i]?.current?.style) {
          cardRefs[i].current.style.display = 'flex';
        }
      }

      setScores({});
      setCards([...card]);
      console.log(card);
      setIsSuffled(suffle);
    };  

    const handlePlayerSelectUpdate = ({ playerIndex, score, suffle }) => {
      console.log('recieved player select socket',playerIndex,score,suffle); 
      setPlayerIdx(playerIndex);
      setScores(score);

      console.log('new playerIdx:',playerIdx);
      console.log('new scores:',scores);
    
      const playersObj = playersJoined.reduce((acc, player) => {
        acc[player.name] = player.score;
        return acc;
      }, {});
    
      console.log('playersObj:',playersObj);
    
      const players = [{}, {}, {}, {}];
      for (const key in score) {
        const { score: addedScore, role } = score[key];
        const playerObj = { name: key, score: (playersObj[key] || 0) + addedScore };
    
        if (role === 'Raja') {
          players[0] = playerObj;
        }
        if (role === 'Mantri') {
          players[1] = playerObj;
        }
        if (role === 'Sipahi') {
          players[2] = playerObj;
        }
        if (role === 'Chor') {
          players[3] = playerObj;
        }
      }
    
      console.log('new players:',players);
      setPlayersJoined(players);

      console.log('new playerJoined:',playersJoined);
    
      setTimeout(() => {
        console.log('suffling...................');
        console.log('suffling player idx:',playerIdx);
        setIsSuffled(suffle);
      }, 2000);
    };
    
    console.log('wwssssssss',playerIdx);
    console.log('aaaaaaaaaa',playersJoined);
    console.log('aaaaaaaaaaa',isSuffled);

    useEffect(()=>{

      socket.on(`/${teamSelected}/cardSelect`, handleCardSelectUpdate);
      socket.on(`/${teamSelected}/suffle`,handleCardShuffleUpdate);
      socket.on(`/${teamSelected}/playerSelected`,handlePlayerSelectUpdate);
      return () => {
        socket.off(`/${teamSelected}/cardSelect`, handleCardSelectUpdate);
        socket.off(`/${teamSelected}/suffle`,handleCardShuffleUpdate);
        socket.off(`/${teamSelected}/playerSelected`,handlePlayerSelectUpdate);
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
                    <div className='player one' onClick={()=>handlePlayerClick(teamMates?.firstPlayerUserName)}>
                        <p className='player-name'>{teamMates?.firstPlayerUserName || 'Player 1'}</p>
                        <p className='player-role'>Role: {scores[teamMates?.firstPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.firstPlayerUserName]?.score || 'none'}</p>
                    </div>
                    <div className='player two' onClick={()=>handlePlayerClick(teamMates?.secondPlayerUserName)}>
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

                    <div className='player three' onClick={()=>handlePlayerClick(teamMates?.thirdPlayerUserName)}>
                        <p className='player-name'>{teamMates?.thirdPlayerUserName || 'Player 3'}</p>
                        <p className='player-role'>Role: {scores[teamMates?.thirdPlayerUserName]?.role || 'none'}</p>
                        <p className='player-score'>Score: {scores[teamMates?.thirdPlayerUserName]?.score || 'none'}</p>
                    </div>
                    <div className='player four' onClick={()=>handlePlayerClick(teamMates?.fourthPlayerUserName)}>
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
