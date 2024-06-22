import React, { useState, useEffect, useRef } from 'react';
import './PlayGame.css';

function PlayGame() {
    const [openChat, setOpenChat] = useState(window.innerWidth > 920); // Initial state based on window width
    const chatAreaRef = useRef(null); // Ref to the chat area DOM element

    // Function to handle window resize
    const handleResize = () => {
        if (window.innerWidth > 920) {
            setOpenChat(true); // Show chat area if window width is greater than 920
        } else {
            setOpenChat(false); // Hide chat area if window width is 920 or less
        }
    };

    // Function to handle click outside the chat area
    // const handleClickOutside = (event) => {
        // if (chatAreaRef.current && !chatAreaRef.current.contains(event.target) && window.innerWidth <= 920) {
            // setOpenChat(false); // Close chat area if clicked outside and window width is 920 or less
        // }
    // };


    //.....................other........................//
    const handleClickOutSideChatArea=()=>{
        // setOpenChat(false);
    }

    // Effect hook to add event listeners for resize and click outside events
    useEffect(() => {
        window.addEventListener('resize', handleResize); // Listen for window resize
        // document.addEventListener('mousedown', handleClickOutside); // Listen for click outside

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up resize listener
            // document.removeEventListener('mousedown', handleClickOutside); // Clean up click outside listener
        };
    }, []); // Empty dependency array ensures effect runs only on mount and unmount

    // Style object for the chat area
    const mystYle = {
        display: openChat ? 'block' : 'none', // Show or hide chat area based on openChat state
        width: '320px', // Fixed width for the chat area (can be adjusted)
    //    height:'auto'
    };

    return (
        <div className='container'>
            <div className='open-chat' onClick={() => setOpenChat(prev => !prev)}>Chat</div>
            <div className='game-area' onClick={handleClickOutSideChatArea} >
                {/* Game area content */}
                <div className='game-show-area'>
                    <div className='player one'>
                        <p className='player-name'>Player 1</p>
                        <p className='player-score'>Score: 10</p>
                    </div>
                    <div className='player two'>
                        <p className='player-name'>Player 2</p>
                        <p className='player-score'>Score: 8</p>
                    </div>
                    <div className='score'>Scores</div>
                    <div className='player three'>
                        <p className='player-name'>Player 3</p>
                        <p className='player-score'>Score: 15</p>
                    </div>
                    <div className='player four'>
                        <p className='player-name'>Player 4</p>
                        <p className='player-score'>Score: 5</p>
                    </div>
                </div>
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
                <div className='sent-chats'></div>
                <input className='chat' placeholder='My message'></input>
                <button type='button' className='sendBtn'>Send</button>
            </div>
        </div>
    );
}

export default PlayGame;
