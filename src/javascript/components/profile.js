import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import WaitListItem from '../components/waitlist-item';
import {loadUserData, updateUserData, editUserData, isOnboarded} from '../stores/userStore';
import {showModal} from '../stores/profileImageStore';
import ImageSelection from './image-selection-modal';

class Profile extends React.Component {

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
    console.log('Save profile: ' + JSON.stringify(data));
    this.props.updateUserData(userId, data);
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
    return !isUserOnboarded || this.props.user.isEditable ? (
      <div>
        Tell us a little bit more about you:
        <Row>
          <Col className='col-xs-12 col-lg-2'>
            <Avatar
              onClick={this.selectImage}
              size={50}
              src={photo}
            />
            {imageSelectionModal}
          </Col>
          <Col className='col-xs-12 col-lg-4'>
            <TextField defaultValue={name} hintText="Name" onChange={this.changeName}/>
          </Col>
          <Col className='col-xs-12 col-lg-4'>
            <TextField defaultValue={interests} hintText="Interests" onChange={this.changeInterests}/>
          </Col>
          <Col className='col-xs-12 col-lg-2'>
            <RaisedButton label="OK" onClick={this.saveProfile}/>
          </Col>
        </Row>
      </div>
    ) : (
      <div>
        <WaitListItem photo={photo} interests={interests} name={name} onClick={this.setEditable}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.user,
  isUserOnboarded: isOnboarded(state.user),
  showModal: state.profileImage.showModal
});

const mapDispatchToProps = dispatch => ({
  editUserData: () => dispatch(editUserData()),
  loadUserData: (userId) => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
