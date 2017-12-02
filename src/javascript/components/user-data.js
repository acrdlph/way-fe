import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import {NavLink} from 'react-router-dom';
import InfoBox from './infobox';
import WaitListItem from '../components/waitlist-item';
import {trackEvent, events} from '../util/google-analytics';
import {loadUserData, updateUserData, editUserData, isOnboarded} from '../stores/userStore';
import {showModal} from '../stores/profileImageStore';
import ImageSelection from './image-selection-modal';
import './user-data.less';

class UserData extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      interests: ''
    };
    this.changeInterests = this.changeInterests.bind(this);
    this.changeName = this.changeName.bind(this);
    this.setEditable = this.setEditable.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  changeInterests(event, interests) {
    this.setState({interests});
  }

  changeName(event, name) {
    this.setState({name});
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
      interests: this.state.interests
    };
    this.props.updateUserData(userId, data);
    trackEvent(events.USER_CHANGED_PROFILE_DATA);
  }

  refreshProfile() {
    const userId = sessionStorage.getItem('userId');
    this.props.loadUserData(userId);
  }

  render() {
    const {user, isUserOnboarded} = this.props;
    if(user.loading) {
      return (<div>loading...</div>);
    }
    const imageSelectionModal = this.props.showModal ?
      <ImageSelection onUpload={this.refreshProfile} /> : null;
    const name = _.get(user, 'data.name', '');
    const interests = _.get(user, 'data.interests', '');
    const photo = _.get(user, 'data.photo', 'assets/avatar-placeholder.png');
    const registerText = (
      <span>You are using WaitList as a guest. <NavLink to='/register'>Register now</NavLink> to save your profile or just <NavLink to='/login'>log in</NavLink> if you have already an account.</span>
    );

    return !isUserOnboarded || this.props.user.isEditable ? (
      <div className='userdata'>
        <Row>
          <Col className='col-xs-12 col-lg-4'>
            <Avatar
              onClick={this.selectImage}
              size={100}
              src={photo}
            />
            {imageSelectionModal}
          </Col>
          <Col className='col-xs-12 col-lg-8'>
            <TextField
              defaultValue={name}
              hintText="Name"
              onChange={this.changeName}
              fullWidth={true}
            />
          </Col>
          <Col className='col-xs-12 col-lg-8'>
            <TextField
              defaultValue={interests}
              hintText="What are you looking for?"
              onChange={this.changeInterests}
              fullWidth={true}
            />
          </Col>
          <Col className='col-xs-12 col-lg-8'>
            <RaisedButton
              label="OK"
              backgroundColor='#ffd801'
              onClick={this.saveAndContinue}
              onClick={this.saveProfile}
              fullWidth={true}
            />
          </Col>
        </Row>
      </div>
    ) : (
      <div>
        <WaitListItem photo={photo} interests={interests} name={name} onClick={this.setEditable}/>
        <InfoBox visible={!this.props.isRegisteredUser} text={registerText}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.user,
  isRegisteredUser: !!state.user.data.username,
  isUserOnboarded: isOnboarded(state.user),
  showModal: state.profileImage.showModal
});

const mapDispatchToProps = dispatch => ({
  editUserData: () => dispatch(editUserData()),
  loadUserData: (userId) => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserData);
