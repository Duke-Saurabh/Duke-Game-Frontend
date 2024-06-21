import React from 'react';
import './PlayGame.css';

function PlayGame() {
    return (
        <div className='container'>
            <div className='game-area'>
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
            <div className='chat-area'>
                <div className='chat'>My message</div>
            </div>
        </div>
    );
}

export default PlayGame;
