import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import TextField from 'material-ui/TextField';
import WaitListItem from '../components/waitlist-item';
import {loadUserData} from '../stores/userStore';

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      interests: '',
      isEditable: false
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

  setEditable(editable) {
    this.setState({isEditable: editable});
  }

  saveProfile() {
    console.log('Save profile: ' + JSON.stringify(this.state));
    const {interests, name} = this.state;
    const userId = sessionStorage.getItem('userId');
    const endpoint = 'api/users/'+userId;
    const body = JSON.stringify({
      interests,
      name
    });
    fetch(endpoint, {
      method: 'put',
      body,
      headers: new Headers({
        'content-type': 'application/json'
      }),
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({isEditable: false});
      this.props.loadUserData(userId);
    });
  }

  render() {
    const user = this.props.user;
    const interests = user.data.interests || '';
    const name = user.data.name || '';
    const isDataDefined = name.trim() !== '' && interests.trim() !== '';

    if(user.loading) {
      return (<div>loading...</div>);
    }
    return !isDataDefined || this.state.isEditable ? (
      <div>
        Tell us a little bit more about you:
        <TextField defaultValue={interests} hintText="Interests" onChange={this.changeInterests}/>
        <TextField defaultValue={name} hintText="Name" onChange={this.changeName}/>
        <Button onClick={this.saveProfile}>OK</Button>
      </div>
    ) : (
      <div>
        <WaitListItem interests={interests} name={name}/>
        <Button onClick={() => this.setEditable(true)}>Change Profile</Button>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  loadUserData: (userId) => dispatch(loadUserData(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
