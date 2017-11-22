import React from 'react';
import './header.less';

export default class Header extends React.Component {
  render() {
    const isInChat = this.props.location.pathname.includes('chat');
    if(isInChat) {
      return null;
    } else {
      return (
        <div className="header">
          <img
            className='logo'
            src='assets/waitlistlogo.svg'
          />
        </div>
      );
    }
  }
}
