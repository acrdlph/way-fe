import React from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import {trackPageView} from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import {Grid, Row, Col} from 'react-bootstrap';
import ImageSelection from '../components/image-selection-modal';
import {showModal} from '../stores/profileImageStore';
import {loadUserData, updateUserData, editUserData, isOnboarded} from '../stores/userStore';
import './profile.less';


class Profile extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);
    const userId = sessionStorage.getItem('userId');
    console.log("user id",userId)
    this.props.loadUserData(userId);

    this.onSave = this.onSave.bind(this);
    this.onChanged = this.onChanged.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.onLogout = this.onLogout.bind(this);

    this.state = {
      name: this.props.name,
      email: this.props.email,
      username: this.props.username,
      interests: this.props.interests
    }
  }

  refreshProfile() {
    const userId = sessionStorage.getItem('userId');
    this.props.loadUserData(userId);
  }

  onChanged(e){
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  onImageClick() {
    this.props.openModal();
  }


  onChangeImage(e){
    console.log(e)
  }

  onLogout() {
    sessionStorage.clear();
    this.props.history.push(`/signup`);
  }

  onSave(e) {
    if (!this.props.isRegisteredUser) {
      this.props.history.push(`/signup`);
    }

    const userId = sessionStorage.getItem('userId');
    const data = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      interests: this.state.interests
    };
    this.props.updateUserData(userId, data);
  }

  render() {
    const { username, name, interests, photo } = this.props;
    console.log(username, name, interests, photo);
    const imageSelectionModal = this.props.showModal ?
    <ImageSelection onUpload={this.refreshProfile} /> : null;

    return (
      <Grid className="profile">
        <Row>
          <Col sm={12}>
            <Avatar
              onClick={this.onImageClick}
              size={100}
              src={photo}
            />
            {imageSelectionModal}
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <TextField
              value={this.props.username}
              name="username"
              floatingLabelText="Username"
              onChange={this.onChanged}
              fullWidth={true}
            />
            <TextField
              name="name"
              value={name}
              floatingLabelText="Name"
              onChange={this.onChanged}
              fullWidth={true}
            />
            <TextField
              name="interest"
              value={interests}
              floatingLabelText="Interest"
              onChange={this.onChanged}
              fullWidth={true}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <button className={this.props.isRegisteredUser ? 'save registered' : 'save not-registered'} onClick={this.onSave}>
              { this.props.isRegisteredUser ? 'Save' : 'Register' }
            </button>
            { this.props.isRegisteredUser ? <button onClick={this.onLogout}>logout</button> : '' }
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.user.data);
  return {
    ...state.user.data,
    isRegisteredUser: !!state.user.data.username,
    isUserOnboarded: isOnboarded(state.user),
    showModal: state.profileImage.showModal
  }
};

const mapDispatchToProps = dispatch => ({
  loadUserData: (userId) => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
