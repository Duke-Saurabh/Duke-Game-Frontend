import React from 'react'
import './Footer.css';

function Footer() {
  const isGameOn=false;
  const a=true;
  return (
    <div className='footer'>
      {
        isGameOn && 
       ( <div className='game-footer'>
          {
            a && (<button className='suffleBtn'>Suffle</button>)
          }
          
          <button className='chatBtn'>Chat</button>
        </div>
       )

       ||

       (
        <div className='simple-footer'>Footer</div>
       )
      }
    </div>
  )
}

export default Footer