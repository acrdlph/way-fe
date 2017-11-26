import React from 'react';
import {Card} from 'material-ui/Card';
import './header.less';

export default class Header extends React.Component {
  render() {
    const isInChat = this.props.location.pathname.includes('chat');
    if(isInChat) {
      return null;
    } else {
      return (
        <Card className='header'>
          <img
            className='logo'
            src='assets/waitlistlogo.svg'
          />
        </Card>
      );
    }
  }
}
