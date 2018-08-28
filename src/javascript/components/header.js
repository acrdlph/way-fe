import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Card } from 'material-ui/Card';
import MaterialUiAvatar from 'material-ui/Avatar';
import { PAGES_WITH_HEADER } from '../util/constants';
import { isLoggedIn } from '../stores/accountStore';
import { extractLocationName } from './location-header';
import ChatHeader from './chat-header';
import { showTheModal } from '../stores/modalStore';
import GenericModal from './Modal';
import { onBoardingContent } from './onBoardingModalContent';
import './header.less';

const createBackButton = (to) => {
  return (
    <NavLink to={to}>
      <span className="glyphicon glyphicon glyphicon-chevron-left" />
    </NavLink>
  );
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show : true };
    this.openTheModal = this.openTheModal.bind(this);
  };
  
  openTheModal() {
    this.props.openTheModal();
  }

  render() {
    const { username, photo, locationName, chatPartner, name } = this.props;
    const { pathname } = this.props.location;
    const isHeaderVisible = _.filter(PAGES_WITH_HEADER, page => pathname.includes(page)).length > 0;
    const isInChat = pathname.includes('chat');

    if (!isHeaderVisible) {
      return null;
    }

    if (isInChat) {
      return <ChatHeader chatPartner={chatPartner} />;
    }

    let backButton = null;

    const isInProfile = pathname.includes('profile');
    if (isInChat || isInProfile) {
      backButton = createBackButton('/waitlist');
    };
    const isInFeedback = this.props.location.pathname.includes('feedback');
    const isInLegalNotice = this.props.location.pathname.includes('legalnotice');
    if (isInFeedback || isInLegalNotice) {
      backButton = createBackButton('/');
    };

    const Modal = this.props.showTheModal ?
    <GenericModal content={onBoardingContent} /> : null;

    const profileIcon = iconHide => {
      return (
      <div className={iconHide ? 'header-profileicon-hidden' : 'header-profileicon'}>
        <NavLink to='/profile'>
          <span className='header-profileicon-username'>
            {username || name}
          </span>
          <MaterialUiAvatar
            size={35}
            src={photo}
          />
        </NavLink>
      </div>)
    };
    
    const questionMarkIcon = (
      <div className='questionmark-icon'>
        <button className='questionmark-button' onClick={this.openTheModal}>
          <img src='assets/questionMark.svg'/>
        </button>
      </div>
    );

    const location = locationName ? (
      <div className='header-location'>
        <NavLink to='/signup'>{locationName}</NavLink>
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
          <NavLink to='/'>
            <img
              src='assets/bglogo.png'
            />
          </NavLink>
        </div>
        {pathname === '/register' ? profileIcon(true) : profileIcon(false)}
        <div>
           {Modal}
           {questionMarkIcon}
        </div>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  username: _.get(state.user, 'data.username'),
  name: _.get(state.user, 'data.name', ''),
  photo: _.get(state.user, 'data.photo', 'assets/avatar-placeholder.png'),
  locationName: extractLocationName(state),
  chatPartner: _.get(state.chatPartner, 'data'),
  showTheModal: state.modalStore.showTheModal,
});
const mapDispatchToProps = dispatch => ({
  openTheModal: () => dispatch(showTheModal(true))
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
