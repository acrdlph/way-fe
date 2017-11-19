import React from 'react';
import './header.less';

export default class Header extends React.Component {
  render() {
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
