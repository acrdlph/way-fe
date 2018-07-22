import React from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {trackPageView, trackEvent, events} from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import {login} from '../stores/accountStore';
import './login.less';

class Login extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.pathname;
    trackPageView(path);

    this.state = {
      loginName: '',
      password: ''
    };

    this.login = this.login.bind(this);
    this.changeLoginName = this.changeLoginName.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentWillReceiveProps(props) {
    console.log('was called now');
    if(props.account.wasLoginSuccessful && !this.props.account.wasLoginSuccessful) {
      sessionStorage.setItem('userId', props.account.userId);
      trackEvent(events.USER_LOGGED_IN);
    }
  }

  changeLoginName(event, loginName) {
    this.setState({loginName});
  }
  changePassword(event, password) {
    this.setState({password});
  }

  login() {
    const {loginName, password} = this.state;
    this.props.login(loginName, password);
    this.props.onClick(this.props.account.wasLoginSuccessful);
  }

  render() {
    return (
      <div className='login container'>
        <TextField
          id='username'
          className='username'
          floatingLabelText="Username or Email"
          onChange={this.changeLoginName}
          fullWidth={true}
        />

        <TextField
          id='password'
          className='password'
          floatingLabelText="Password"
          type="Password"
          onChange={this.changePassword}
          fullWidth={true}
        />

        <RaisedButton
          label="Log In"
          backgroundColor='#43D676'
          onClick={this.login}
          fullWidth={true}
        />

        <InfoBox text={"Invalid username or password!"} visible={this.props.account.hasLoginFailed}/>


       {/* <div className='login-reset-password'>
          Forgot password? <NavLink to='/reset-password'>Reset it!</NavLink>
    </div>*/}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account
});
const mapDispatchToProps = dispatch => ({
  login: (userLogin, password) => dispatch(login(userLogin, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
