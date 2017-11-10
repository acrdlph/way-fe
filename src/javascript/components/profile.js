import React from 'react';
import {Button} from 'react-bootstrap'
import TextField from 'material-ui/TextField';

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
    this.saveProfile = this.saveProfile.bind(this);
  }

  changeInterests(event, interests) {
    this.setState({interests});
  }

  changeName(event, name) {
    this.setState({name});
  }

  saveProfile() {
    console.log('Save profile: ' + JSON.stringify(this.state));
    this.setState({hidden: true});
  }

  render() {
    return this.state.hidden ? null : (
      <div>
        Tell us a little bit more about you:
        <TextField hintText="Interests" onChange={this.changeInterests}/>
        <TextField hintText="Name" onChange={this.changeName}/>
        <Button onClick={this.saveProfile}>OK</Button>
      </div>
    );
  }
}
