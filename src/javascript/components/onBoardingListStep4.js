import React from 'react';

const onBoardingContent = close => (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-nerd.png" />
    </div>
    <div className="welcomeBox">
      <h3>Welcome to the Geek List</h3>
    </div>
    <div className="middleBox">
      <p className="middleText">
        That’s it. You are all set on the Geek List. Now it’s time to see who’s already on.
      </p>
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
        <li>●</li>
        <li>●</li>
        <li className="blackPoint">●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
