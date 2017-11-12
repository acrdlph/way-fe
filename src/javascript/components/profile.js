import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import TextField from 'material-ui/TextField';
import WaitListItem from '../components/waitlist-item';
import {loadUserData, updateUserData, editUserData} from '../stores/userStore';

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
  }

  changeInterests(event, interests) {
    this.setState({interests});
  }

  changeName(event, name) {
    this.setState({name});
  }

  setEditable() {
    console.log("edit user data..");
    this.props.editUserData();
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

  render() {
    const user = this.props.user;
    const interests = user.data.interests || '';
    const name = user.data.name || '';
    const isDataDefined = name.trim() !== '' && interests.trim() !== '';
    console.log("usererer: " + JSON.stringify(user));
    if(user.loading) {
      return (<div>loading...</div>);
    }
    return !isDataDefined || this.props.user.isEditable ? (
      <div>
        Tell us a little bit more about you:
        <TextField defaultValue={interests} hintText="Interests" onChange={this.changeInterests}/>
        <TextField defaultValue={name} hintText="Name" onChange={this.changeName}/>
        <Button onClick={this.saveProfile}>OK</Button>
      </div>
    ) : (
      <div>
        <WaitListItem interests={interests} name={name}/>
        <Button onClick={this.setEditable}>Change Profile</Button>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  editUserData: () => dispatch(editUserData()),
  loadUserData: (userId) => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
