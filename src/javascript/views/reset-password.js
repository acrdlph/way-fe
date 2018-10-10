import React from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import Arrow from 'material-ui/svg-icons/hardware/keyboard-backspace';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import {login} from '../stores/accountStore';
import './reset-password.less';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);

    this.state = {
      login: null
    };
    this.changeLogin = this.changeLogin.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }

  changeLogin(event, login) {
    this.setState({login});
  }

  goToLogin() {
    this.props.history.push('/signup');
  }

  resetPassword() {
    const {login} = this.state;

    // TODO: call password reset endpoint here
  }

  render() {
    return (
      <div className="resetContainer">
        <div className="resetBox">
          <div className="arrowResetBox">
            <Arrow onClick={this.goToLogin} />
          </div>
          <div className="textResetBox">
            <h3>Reset your password</h3>
            <p>Type in below the email address associated with your CryptoGeeks account to reset your forgotten password.</p>
          </div>
          <Form>
            <FormGroup>
              <Input
                placeholder="Email"
                onChange={this.changeLogin}
              />
             </FormGroup>
          </Form>
          <Button
            onClick={this.resetPassword}
          >Continue</Button>
        </div>
        <div className="termsBox">
          <p>By continuing, you agree to our <a href="">Terms of Service, Privacy Policy</a> & <a href="">Cookie use.</a></p>
          <p><a href="">Powered by Way Network · Legal Notice · Feedback</a></p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
