import React from 'react';

const onBoardingContent = (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-rocket.png" />
    </div>
    <div className="welcomeBox">
      <h3>Spread the Word with Local Discussions</h3>
    </div>
    <div className="middleBox">
      <img className="iconEndorse" src="assets/32-icon-onboarding-signal.svg" />
      <p>Signal hot events for the crypto community, ask questions, share ideas.</p>
    </div>
    <div className="linkBox">
      {
        // <p>🎬 Watch the video</p>
      }
      <ul>
        <li className="blackPoint">●</li>
        <li>●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
