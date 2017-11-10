import React from 'react';
import {Button} from 'react-bootstrap'
import TextField from 'material-ui/TextField';
import fetch from 'isomorphic-fetch'
import WaitListItem from '../components/waitlist-item';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      interests: '',
      hidden: false
    };
    this.changeInterests = this.changeInterests.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeProfile = this.changeProfile.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  changeInterests(event, interests) {
    this.setState({interests});
  }

  changeName(event, name) {
    this.setState({name});
  }

  changeProfile() {
    this.setState({hidden: false});
  }

  saveProfile() {
    console.log('Save profile: ' + JSON.stringify(this.state));
    const {interest, name} = this.state;
    const userId = sessionStorage.getItem('userId');
    const endpoint = 'api/users/'+userId;
    fetch(endpoint, {
      method: 'put',
      body: {
        interest,
        name
      },
      headers: new Headers({
        'content-type': 'application/json'
      }),
    })
    .then((res) => res.json())
    .then((json) => {
      this.setState({hidden: true});
    });
  }

  render() {
    const {interests, name, hidden} = this.state;
    return !hidden ? (
      <div>
        Tell us a little bit more about you:
        <TextField defaultValue={interests} hintText="Interests" onChange={this.changeInterests}/>
        <TextField defaultValue={name} hintText="Name" onChange={this.changeName}/>
        <Button onClick={this.saveProfile}>OK</Button>
      </div>
    ) : (
      <div>
        <WaitListItem interests={interests}/>
        <Button onClick={this.changeProfile}>Change Profile</Button>
      </div>
    );
  }
}
