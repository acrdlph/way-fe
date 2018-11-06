import React from 'react';
import './onBoardingList.less';

const onBoardingContent = (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-grandpa.png" />
    </div>
    <div className="welcomeBox">
      <h3>Say hi to your personal profile</h3>
    </div>
    <div className="middleBox">
      <img src="assets/32-icon-onboarding-status.svg" />
      <p>Change your status to make it easier for people to connect with you.</p>
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
