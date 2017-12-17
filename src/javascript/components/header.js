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
    <NavLink to={to}>
      <span className="glyphicon glyphicon glyphicon-chevron-left"/>
    </NavLink>
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
    const isInProfile = this.props.location.pathname.includes('profile');
    if(isInChat || isInProfile) {
      backButton = createBackButton('/waitlist');
    };
    const isInFeedback = this.props.location.pathname.includes('feedback');
    const isInLegalNotice = this.props.location.pathname.includes('legalnotice');
    if(isInFeedback || isInLegalNotice) {
      backButton = createBackButton('/');
    };

    const {username, photo, locationName} = this.props;
    const profileIcon = isLoggedIn() ? (
      <div className='header-profileicon'>
        <NavLink to='/profile'>
          <span className='header-profileicon-username'>
            {username}
          </span>
          <MaterialUiAvatar
            size={35}
            src={photo}
          />
        </NavLink>
      </div>
    ) : null;

    const location = locationName ? (
      <div className='header-location'>
        {locationName}
        <img
          src='assets/waitlist-location-icon.png'
        />
      </div>
    ) : null;

    return (
      <Card className='header'>
        <div className='header-back-button'>
          {backButton}
        </div>
        <div className='header-logo'>
          <img
            src='assets/waitlistlogo.svg'
          />
        </div>
        {location}
        {profileIcon}
      </Card>
    );
  }
}

const extractLocationName = (state) => {
  const locationKey = _.get(state.user, 'data.location');
  if(locationKey && state.partners.loaded) {
    console.log("locationKey", locationKey);
    const locationNumber = _.findKey(state.partners.data, (loc) => {
      return (loc.uniqueKey === locationKey.toUpperCase() || loc.location === locationKey.toUpperCase());
    });
    if(locationNumber) {
      return state.partners.data[locationNumber].name;
    }
  }
  return null;
};

const mapStateToProps = (state) => ({
  username: _.get(state.user, 'data.username'),
  photo: _.get(state.user, 'data.photo', 'assets/avatar-placeholder.png'),
  locationName: extractLocationName(state)
});

export default connect(mapStateToProps)(Header);
