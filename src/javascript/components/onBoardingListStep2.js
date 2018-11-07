import React from 'react';

const onBoardingContent = (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-nerd.png" />
    </div>
    <div className="welcomeBox">
      <h3>Welcome to the Geek List</h3>
    </div>
    <div className="middleBox">
      <img className="iconChat" src="assets/32-icon-onboarding-chat.svg" />
      <p>Use the Chat to talk and meet with interesting people.</p>
    </div>
    <div className="linkBox">
      {
        // <p>🎬 Watch the video</p>
      }
      <ul>
        <li>●</li>
        <li className="blackPoint">●</li>
        <li>●</li>
        <li>●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
