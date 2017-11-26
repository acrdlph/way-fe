import React from 'react';
import dateFormat from 'dateformat';
import Avatar from 'material-ui/Avatar';
import './conversation.less';

const CHAT_BUBBLE_COLOR_LEFT = '#FFA500';
const CHAT_BUBBLE_COLOR_RIGHT = '#00FF7F';

export default class Conversation extends React.Component {

  render() {
    const {user, users, messages} = this.props;
    const bubbles = messages.map(msg => {
      const cssClass = msg.sender === user ? 'right' : 'left';
      const time = dateFormat(msg.createdAt, 'hh:MM');
      const name = users[msg.sender];
      const style = {
        backgroundColor: msg.sender === user ? CHAT_BUBBLE_COLOR_LEFT : CHAT_BUBBLE_COLOR_RIGHT
      };
      let photo = 'assets/avatar-placeholder.png';
      if(msg.sender === user && this.props.userPhoto) {
        photo = this.props.userPhoto;
      }

      return (
        <div key={msg.id} className='chat-item-wrapper'>
          <div className={`chat-item chat-item-${cssClass}`}>
            <div className={`avatar avatar-${cssClass}`}>
              <Avatar
                size={50}
                src={photo}
              />
            </div>
            <div className={`content content-${cssClass}`}>
              <div className='bubble' style={style}>
                {msg.message}
              </div>
              <div className='meta-info'>
                {name + " / " + time}
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className='chat'>
        {bubbles}
      </div>
    );
  }

}
