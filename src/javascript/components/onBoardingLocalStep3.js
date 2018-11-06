import React from 'react';

const onBoardingContent = close => (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-rocket.png" />
    </div>
    <div className="welcomeBox">
      <h3>Spread the Word with Local Discussions</h3>
    </div>
    <div className="middleBox">
      <p>You’re all set. Let’s dig in and start sharing valuable content for your community.</p>
      <button onClick={e => close(e)} className="btnStart">
        Alright
      </button>
    </div>
    <div className="linkBox">
      {
        // <p>🎬 Watch the video</p>
      }
      <ul>
        <li>●</li>
        <li className="blackPoint">●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
