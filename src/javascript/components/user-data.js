import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { NavLink } from 'react-router-dom';
import Avatar from './avatar';
import InfoBox from './infobox';
import WaitListItem from './waitlist-item';
import { trackEvent, events } from '../util/google-analytics';
import {
  loadUserData, updateUserData, editUserData, isOnboarded,
} from '../stores/userStore';
import { isLoggedIn } from '../stores/accountStore';
import { showModal } from '../stores/profileImageStore';
import ImageSelection from './image-selection-modal';
import './user-data.less';
import { Web3Provider } from 'react-web3';
import Web3Component, { initContract } from './Web3Component';

class UserData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      interests: '',
    };
    this.changeInterests = this.changeInterests.bind(this);
    this.changeName = this.changeName.bind(this);
    this.setEditable = this.setEditable.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  changeInterests(event, interests) {
    this.setState({ interests });
  }

  changeName(event, name) {
    this.setState({ name });
  }

  setEditable() {
    this.props.editUserData();
  }

  selectImage() {
    this.props.openModal();
  }

  saveProfile() {
    const userId = sessionStorage.getItem('userId');
    const data = {
      name: this.state.name,
      interests: this.state.interests,
    };
    this.props.updateUserData(userId, data);
    trackEvent(events.USER_CHANGED_PROFILE_DATA);
  }

  refreshProfile() {
    const userId = sessionStorage.getItem('userId');
    this.props.loadUserData(userId);
  }

  render() {
    const { user, isUserOnboarded, address } = this.props;
    if (user.loading) {
      return <div>loading...</div>;
    }
    const imageSelectionModal = this.props.showModal ? (
      <ImageSelection onUpload={this.refreshProfile} />
    ) : null;
    const name = _.get(user, 'data.name', '');
    const interests = _.get(user, 'data.interests', '');
    const endorsement = _.get(user, 'data.endorsement', '');
    const photo = _.get(user, 'data.photo', 'assets/32-icon-avatar.svg');
    const registerText = (
      <span>
        Register
        {' '}
        <NavLink to="/register">here</NavLink>
        {' '}
to retain your GEEK status
      </span>
    );

    return !isUserOnboarded || this.props.user.isEditable ? (
      <div className="userdata">
        <Row>
          <Col className="col-xs-12 col-lg-12">
            <Avatar onClick={this.selectImage} size={100} src={photo} displayPlus />
            {imageSelectionModal}
          </Col>
          <Col className="col-xs-12 col-lg-12 name-inputfield">
            <TextField defaultValue={name} hintText="Name" onChange={this.changeName} fullWidth />
          </Col>
          <Col className="col-xs-12 col-lg-12 description-inputfield">
            <TextField
              defaultValue={interests}
              hintText="What are your incentives?"
              onChange={this.changeInterests}
              fullWidth
            />
          </Col>
          <Col className="col-xs-12 col-lg-12 userdata-confirm-button">
            <RaisedButton
              label="OK"
              backgroundColor="#43d676"
              onClick={this.saveAndContinue}
              onClick={this.saveProfile}
              fullWidth
            />
          </Col>
        </Row>
      </div>
    ) : (
      <div>
        <InfoBox visible={!isLoggedIn()} text={registerText} />
        <WaitListItem
          endorsement={endorsement}
          photo={photo}
          interests={interests}
          name={name}
          address={address}
          onClick={this.setEditable}
          isActionVisible={false}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isUserOnboarded: isOnboarded(state.user),
  showModal: state.profileImage.showModal,
});

const mapDispatchToProps = dispatch => ({
  editUserData: () => dispatch(editUserData()),
  loadUserData: userId => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserData);
