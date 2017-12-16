import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import MaterialUiAvatar from 'material-ui/Avatar';
import {PAGES_WITH_HEADER} from '../util/constants';
import {isLoggedIn} from '../stores/accountStore';
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

class Header extends React.Component {
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

    const {username, photo} = this.props;
    const profileIcon = isLoggedIn() ? (
      <div className='header-profileicon'>
        {username}
        <MaterialUiAvatar
          size={35}
          src={photo}
        />
      </div>
    ) : null;

    return (
      <Card className='header'>
        {backButton}
        <div className='header-logo'>
          <img
            src='assets/waitlistlogo.svg'
          />
        </div>
        {profileIcon}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  username: _.get(state.user, 'data.username'),
  photo: _.get(state.user, 'data.photo', 'assets/avatar-placeholder.png')
});

export default connect(mapStateToProps)(Header);
