import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import {PAGES_WITH_HEADER} from '../util/constants';
import './header.less';

const createBackButton = (to) => {
  return (
    <div className='header-back-button'>
      <NavLink to={to}>
        <span className="glyphicon glyphicon glyphicon-chevron-left"/>
      </NavLink>
    </div>
  );
};

export default class Header extends React.Component {
  render() {

    const {pathname} = this.props.location;
    const isHeaderVisible = _.filter(PAGES_WITH_HEADER, page => pathname.includes(page)).length > 0;
    if(!isHeaderVisible) {
      return null;
    }

    let backButton = null;
    const isInChat = this.props.location.pathname.includes('chat');
    if(isInChat) {
      backButton = createBackButton('/waitlist');
    };
    const isInFeedback = this.props.location.pathname.includes('feedback');
    const isInLegalNotice = this.props.location.pathname.includes('legalnotice');
    if(isInFeedback || isInLegalNotice) {
      backButton = createBackButton('/');
    };


    return (
      <Card className='header'>
        {backButton}
        <img
          className='logo'
          src='assets/waitlistlogo.svg'
        />
      </Card>
    );
  }
}
