import React from 'react';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import './registration.less';

const validateEmailAddress = (email) => {
  if(email && email.trim().length > 4) {
    // TODO: implement real validation
    return true;
  }
  return false;
};

const validatePassword = (password) => {
  if(password && password.trim().length > 3) {
    // TODO: implement real validation
    return true;
  }
  return false;
};

export default class Onboarding extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      errorText: null
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
    const {email, password, passwordConfirm} = this.state;
    console.log("email", email);
    console.log("password", password);

    if(!validateEmailAddress(email)) {
      this.setState({
        errorText: 'Please enter a valid eMail address!'
      });
    } else if(!validatePassword(password) || (password !== passwordConfirm)) {
      this.setState({
        errorText: 'Please enter a valid password!'
      });
    } else {
      this.setState({
        errorText: null
      });
      /*
        TODO: send request to create account here...
      */
    }
  }

  render() {
    const {errorText} = this.state;
    console.log("errorText", errorText);
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

        <InfoBox text={errorText} visible={!!errorText}/>
        <TermsAndPolicy/>
      </div>
    );
  }
}
