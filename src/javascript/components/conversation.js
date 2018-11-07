import React from 'react';
import dateFormat from 'dateformat';
import ReactDOM from 'react-dom';
import { Avatar } from '@material-ui/core';
import './conversation.less';

const CHAT_BUBBLE_COLOR_LEFT = '#0095b3';
const CHAT_BUBBLE_COLOR_RIGHT = '#f1f3f4';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom() {
    const scrollEnd = ReactDOM.findDOMNode(this).getElementsByClassName('chat-scroll-end');
    if (scrollEnd.length) {
      scrollEnd[0].scrollIntoView({ behavior: 'smooth' });
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { user, partner, messages } = this.props;
    const bubbles = messages
      && messages.map((msg) => {
        const date = dateFormat(msg.createdAt, 'dS mmm , H:MM ');
        const otherPhoto = partner.photo;
        const style = {
          backgroundColor:
            msg.sender === user.id ? CHAT_BUBBLE_COLOR_LEFT : CHAT_BUBBLE_COLOR_RIGHT,
        };
        let photo = 'assets/32-icon-avatar.svg';
        let cssClass = 'left';
        if (msg.sender === user.id) {
          cssClass = 'right';
          if (user.photo) {
            photo = user.photo;
          }
          name = user.name;
        } else if (otherPhoto) {
          photo = otherPhoto;
        }
        const undeliveredMsgClass = msg.id ? '' : 'undelivered-msg-style';

        return (
          <div key={msg.local_id} className="chat-item-wrapper">
            <div className={`chat-item chat-item-${cssClass}`}>
              <div className={`avatar avatar-${cssClass}`}>
                <Avatar className="avatar" src={photo} />
              </div>
              <div className={`content content-${cssClass}`}>
                <div className={`bubble ${undeliveredMsgClass}`} style={style}>
                  {msg.message}
                </div>
                <div className="meta-info">{`${date}`}</div>
              </div>
            </div>
          </div>
        );
      });

    return (
      <div className="chat">
        {bubbles}
        <div className="chat-scroll-end" />
      </div>
    );
  }
}
