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
      <img className="iconEndorse" src="assets/32-icon-endorse-active.svg" />
      <p>Endorse a person to increase his reputation and ranking on the list</p>
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
        <li className="blackPoint">●</li>
        <li>●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
