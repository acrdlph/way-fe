import React from 'react';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from '@material-ui/core/Avatar';
import './waitlist-item.less';

export default function WaitListItem(props) {
  let {
    interests,
    name,
    photo,
    hasChat,
    nonDeliveredChatCount,
    lastContact,
    onClick,
    hangoutPlaces,
    onEndorse,
    address,
    endorsement,
    balance,
    id,
  } = props;

  if (interests.trim() === '') {
    interests = 'New member, hit me up!';
  }
  if (name.trim() === '') {
    name = 'No name specified';
  }
  if (!photo) {
    photo = 'assets/32-icon-avatar.svg';
  }

  let alreadyContactedClass = '';
  if (lastContact > 0) {
    alreadyContactedClass = 'waitlist-item-avatar-contacted';
  }
  let hasUnreadMessagesClass = '';
  if (lastContact > 0 && nonDeliveredChatCount > 0) {
    hasUnreadMessagesClass = (
      <p>
        <img src="assets/24-icon-chat.svg" alt="unread messages indicator" />
        {nonDeliveredChatCount}
      </p>
    );
  }

  return (
    <div className="waitlist-item-parent">
      <div className="waitlist-item">
        <div className={`waitlist-item-avatar ${alreadyContactedClass}`}>
          <Avatar size={80} src={photo} />
        </div>
        <div className="waitlist-item-data">
          <p className="waitlist-item-data-name">{name}</p>
          <p className="waitlist-item-data-address">{address}</p>
          <p className="waitlist-item-data-backing">
            Reputation
            <strong>{` ${endorsement} GEEK`}</strong>
          </p>
        </div>
        <div className="waitlist-item-unread">{hasUnreadMessagesClass}</div>
        {id !== sessionStorage.getItem('userId') && (
          <ul className="waitlist-item-actions">
            <li className="endorseBox">
              <button
                type="button"
                className="waitlist-item-button"
                onClick={() => {
                  try {
                    onEndorse(
                      address,
                      {
                        from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
                        gas: 300000,
                        value: web3.toWei(0, 'ether'),
                      },
                      (error, result) => {
                        console.log(result);
                        console.log(error);
                      },
                    );
                  } catch (error) {
                    alert('Metamask is not connected');
                  }
                }}
              >
                <img src="assets/32-icon-endorse.svg" className="icons" />
                {' Endorse '}
              </button>
            </li>
            <li className="endorseBox">
              <button type="button" onClick={props.onClick} className="waitlist-item-button">
                <img src="assets/32-icon-chat.svg" className="icons" />
              </button>
            </li>
            {/*
            <li className="endorseBox">
              <button type="button" onClick={props.onClick} className="waitlist-item-button">
              <img src="assets/32-icon-meet.svg" className="icons" />
              </button>
            </li>
            */}
          </ul>
        )}
      </div>
      <div className="text-location">
        <div className="quoteText">
          <img src="assets/24-icon-incentive.svg" className="icons" />
          <p className="waitlist-item-data-interests">{interests}</p>
        </div>
        <div className="locationBox">
          {hangoutPlaces
            && hangoutPlaces.length !== 0 && <img src="assets/24-icon-spots.svg" className="icons" />}
          {hangoutPlaces.map(place => (
            <p key={place.id} className="locationText">
              {place.place}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
