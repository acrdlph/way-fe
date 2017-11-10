import React from 'react';
import {Button} from 'react-bootstrap'
import TextField from 'material-ui/TextField';
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
    this.setState({hidden: true});
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
