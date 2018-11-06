import React from 'react';
import './onBoardingList.less';

const onBoardingContent = close => (
  <div className="modalContainer">
    <div className="emojiBox">
      <img src="assets/50-emoji-grandpa.png" />
    </div>
    <div className="welcomeBox">
      <h3>Say hi to your personal profile</h3>
    </div>
    <div className="middleBox">
      <p>Beautiful. That’s all there is about your profile. Set yourself up and get connected.</p>
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
