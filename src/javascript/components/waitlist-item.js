import React from 'react';
import {NavLink} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import './waitlist-item.less';

export default class WaitListItem extends React.Component {
  render() {
    let {
      interests,
      name,
      photo,
      timeLeft,
      hasChat,
      nonDeliveredChatCount,
      lastContact,
      onClick
    } = this.props;
    if(interests.trim() === '') {
      interests = "I'm waiting, Chat me up";
    }
    if(name.trim() === '') {
      name = 'No name specified';
    }
    if (!photo) {
      photo = 'assets/avatar-placeholder.png';
    }

    // "timeLeft === undefined" means: this is the profile card
    let timeLeftText = '';
    let arrowClass = 'waitlist-item-invisible';
    if(timeLeft !== undefined) {
      if(timeLeft > 0) {
        timeLeftText = `${timeLeft} min`;
      }
      arrowClass = '';
    }
    let alreadyContactedClass = '';
    if (lastContact > 0) {
      alreadyContactedClass = 'waitlist-item-already-contacted';
    }
    const hasUnreadMessagesClass = nonDeliveredChatCount > 0 ? '' : 'waitlist-item-invisible';

    return (
      <div className={'waitlist-item ' + alreadyContactedClass} onClick={this.props.onClick}>

        <div className='waitlist-item-avatar'>
          <Avatar
            size={50}
            src={photo}
          />
        </div>

        <div className='waitlist-item-data'>
          <div className='waitlist-item-data-name'>
            {name}
          </div>
          <div className='waitlist-item-data-interests'>
            {interests}
          </div>
        </div>

        <div className='waitlist-item-meta'>
          <div className='waitlist-item-meta-timeleft'>
            {timeLeftText}
          </div>
          <div className={'waitlist-item-meta-arrow ' + arrowClass}>
            <span className="glyphicon glyphicon-chevron-right"/>
          </div>
          <div className={'waitlist-item-meta-chat-bubble ' + hasUnreadMessagesClass}>
            <CommunicationChatBubble />
          </div>
        </div>

      </div>
    );
  }
}
