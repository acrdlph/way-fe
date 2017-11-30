import React from 'react';
import './empty-location-message.less';

export default class ChatInput extends React.Component {
  render() {
    return (
      <div className='empty-location-message'>
        <div className='empty-location-message-header'>
          No one here yet.
        </div>
        <div className='empty-location-message-body'>
          Go up to a stranger who looks like someone you would want to meet and tell them about WaitList.
        </div>
      </div>
    );
  }
}
