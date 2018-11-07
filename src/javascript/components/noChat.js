import React from 'react';
import './noChat.less';


const noChat = () => (
    <div className="noChatContainer">
      <div className="noChatBox">
        <div className="messengerBox">
          <img src="assets/24-icon-chat.svg"/>
        </div>
        <div className="chatTitleBox">
          <h3>You have no open chats</h3>
        </div>
        <div className="chatTextBox">
          <p>Start a conversation with a fellow CryptoGeek. There are so many interesting people out there.</p>
        </div>
        <div className="chatBtnBox">
          <button>Back to the List</button>
        </div>
      </div>
    </div>
);

export default noChat;