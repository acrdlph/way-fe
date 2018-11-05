import React from 'react';
import './onBoardingList.less';

const onBoardingContent = (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-nerd.png" />
    </div>
    <div className="welcomeBox">
      <h3>Welcome to the Geek List</h3>
    </div>
    <div className="middleBox">
      <img src="assets/32-slider-onboarding.svg" />
      <p>Use the distance filter to see which people are currently around you.</p>
    </div>
    <div className="linkBox">
      {
        // <p>🎬 Watch the video</p>
      }
      <ul>
        <li className="blackPoint">●</li>
        <li>●</li>
        <li>●</li>
        <li>●</li>
      </ul>
    </div>
  </div>
);
export default onBoardingContent;
