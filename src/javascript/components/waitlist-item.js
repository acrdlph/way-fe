import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Avatar from 'material-ui/Avatar';
import Quote from 'material-ui/svg-icons/editor/format-quote';
import Location from 'material-ui/svg-icons/maps/place';
import Hand from 'material-ui/svg-icons/action/thumb-up';
import Chat from 'material-ui/svg-icons/communication/chat-bubble-outline';
import Friend from 'material-ui/svg-icons/social/people';
import './waitlist-item.less';

export default function WaitListItem(props) {
  let {
    interests,
    name,
    photo,
    timeLeft,
    hasChat,
    nonDeliveredChatCount,
    lastContact,
    onClick,
    onEndorse,
    address,
    endorsement,
    balance,
  } = props;

  if (interests.trim() === '') {
    interests = 'New member, hit me up!';
  }
  if (name.trim() === '') {
    name = 'No name specified';
  }
  if (!photo) {
    photo = 'assets/avatar-placeholder.png';
  }

  let alreadyContactedClass = '';
  if (lastContact > 0) {
    alreadyContactedClass = 'waitlist-item-already-contacted';
  }
  let hasUnreadMessagesClass = '';
  if (lastContact > 0 && nonDeliveredChatCount > 0) {
    hasUnreadMessagesClass = (
      <p>
        <CommunicationChatBubble />
        {nonDeliveredChatCount}
      </p>
    );
  }

  return (
    <div className="waitlist-item-parent">
      <div className={`waitlist-item ${alreadyContactedClass}`}>
        <div className="waitlist-item-avatar">
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
              <Hand className="icons"/>{' Endorse '}
            </button>
          </li>
          <li className="endorseBox">
            <button type="button" onClick={props.onClick} className="waitlist-item-button">
              <Chat className="chatFriend"/>
            </button>
          </li>
          <li className="endorseBox">
            <button type="button" onClick={props.onClick} className="waitlist-item-button">
              <Friend className="chatFriend"/>
            </button>
          </li>
        </ul>
      </div>
      <div className="text-location">
        <div className="quoteText">
          <Quote className="icons"/>
          <p className="waitlist-item-data-interests">{interests}</p>
        </div>
        <div className="locationBox">
          <Location className="icons"/>
          <p className="locationText">Factory Berlin</p>
          <p className="locationText">Cafe Goldshop</p>
          <p className="locationText">Prenzlauer Berg</p>
        </div>
      </div>
    </div>
  );
}
