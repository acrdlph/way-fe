import React from 'react';
import {NavLink} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import './waitlist-item.less';

export default class WaitListItem extends React.Component {
  render() {
    let {
      interests,
      name,
      timeLeft,
      hasChat,
      nonDeliveredChatCount,
      lastContact,
      onClick
    } = this.props;
    if(interests.trim() === '') {
      interests = 'No information available';
    }
    if(name.trim() === '') {
      name = 'No name specified';
    }
    let timeLeftText = '';
    if(timeLeft !== undefined) {
      timeLeftText = `${timeLeft} min`;
    }
    let alreadyContactedClass = '';
    if (lastContact > 0) {
      alreadyContactedClass = 'waitlist-item-already-contacted';
    }

    return (
      <div className={'waitlist-item ' + alreadyContactedClass} onClick={this.props.onClick}>
        <div>
          <div className='waitlist-item-avatar'>
            <Avatar
              size={50}
              src='assets/avatar-placeholder.png'
            />
          </div>
          <div className='waitlist-item-data'>
            <div className='waitlist-item-data-1'>
              <div className='waitlist-item-data-name'>
                {name}
              </div>
              <div className='waitlist-item-data-timeleft'>
                {timeLeftText}
              </div>
            </div>
            <div className='waitlist-item-data-2'>
              {interests}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
