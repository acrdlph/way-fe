import React from 'react';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import './registration.less';

export default class Onboarding extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: ''
    };

    this.register = this.register.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changePasswordConfirm = this.changePasswordConfirm.bind(this);
  }

  changeEmail(event, email) {
    this.setState({email});
  }
  changePassword(event, password) {
    this.setState({password});
  }
  changePasswordConfirm(event, passwordConfirm) {
    this.setState({passwordConfirm});
  }
  register() {
    console.log("email", this.state.email);
    console.log("password", this.state.password);
  }

  render() {
    return (
      <div className='registration'>

        <div className='registration-header'>
          Create a new account
        </div>

        <TextField
          floatingLabelText="Email"
          onChange={this.changeEmail}
          fullWidth={true}
        />

        <TextField
          floatingLabelText="Password"
          type="Password"
          onChange={this.changePassword}
          fullWidth={true}
        />

        <TextField
          floatingLabelText="Password confirmation"
          type="Password"
          onChange={this.changePasswordConfirm}
          fullWidth={true}
        />

        <RaisedButton
          label="OK"
          backgroundColor='#ffd801'
          onClick={this.register}
          fullWidth={true}
        />

      </div>
    );
  }
}
