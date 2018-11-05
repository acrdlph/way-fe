import React from 'react';
import { connect } from 'react-redux';
import { trackPageView } from '../util/google-analytics';
import CircularProgress from '../components/circularProgress';
import TermBox from '../components/termBox';
import { loadPartnerData } from '../stores/partnerStore';
import Login from './login';
import { renderLocationInput, saveAndContinue } from '../util/location';
import './signup.less';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);
    // TODO make this validation using partner api
    this.showSearchBox = this.showSearchBox.bind(this);
    this.showLocationRequired = this.showLocationRequired.bind(this);
    this.toggleDiv = this.toggleDiv.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    this.goToFeedback = this.goToFeedback.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    const userId = sessionStorage.getItem('userId');
    const locationId = sessionStorage.getItem('locationId');
    if (userId && !props.user) {
      this.props.history.push(`/waitlist/${locationId}`); // user is onboarded already
    }
    this.state = {
      showLocationRequiredHint: false,
      isSearchBoxVisible: false,
    };
  }

  componentDidMount() {
    document.title = 'Sign up | CryptoGeeks';
  }

  showSearchBox() {
    this.setState({ isSearchBoxVisible: true });
  }

  showLocationRequired() {
    this.setState({ showLocationRequiredHint: true });
  }

  goToSignup() {
    this.props.history.push('/register');
  }

  goToFeedback() {
    this.props.history.push('/feedback');
  }

  resetPassword() {
    this.props.history.push('/reset-password');
  }

  toggleDiv() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  render() {
    return (
      <div className="signupContainer">
        <div>
          <div className="logoBox">
            <img src="assets/96-cg-logo@2x.png" alt="round logo for login" />
          </div>
          <div className="signupBox">
            <div className="textBox">
              <h3>CryptoGeeks</h3>
              <p>
                Connect with your local blockchain community.
                {
                  // or watch our 🎬 introduction video.
                }
              </p>
            </div>
            <div className="loginBox">
              <Login
                pathname={this.props.location.pathname}
                onClick={saveAndContinue}
                locationId={this.locationId}
                showLocationRequired={this.showLocationRequired}
                showSearchBox={this.showSearchBox}
                history={this.props.history}
                toggleDiv={this.toggleDiv}
              />
              <div className="circularTop">
                {renderLocationInput(
                  this.state.isSearchBoxVisible,
                  this.state.showLocationRequiredHint,
                )}
                {this.state.show && CircularProgress()}
              </div>
            </div>
            <div className="newAccountBox">
              <p>
                Dont have an account?
                {' '}
                <a onClick={this.goToSignup}>
                  Get started now
                  {'   '}
                  <img src="assets/10-icon-bars_2.svg" alt="arrow forward" className="arrow" />
                </a>
              </p>
              {/* <p>
                <a onClick={this.resetPassword}>
                  I forgot my password
                  {' '}
                  <img src="assets/10-icon-bars_2.svg" alt="arrow forward" />
                </a>
              </p> */}
            </div>
          </div>
          <TermBox goToFeedback={this.goToFeedback} history={this.props.history} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  partners: state.partners,
  user: state.user,
  account: state.account,
});
const mapDispatchToProps = dispatch => ({
  loadPartnerData: () => dispatch(loadPartnerData()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signup);
