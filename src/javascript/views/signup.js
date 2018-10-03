import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import TermsAndPolicy from '../components/terms-and-policy';
import { trackPageView } from '../util/google-analytics';
import CircularProgress from '../components/circularProgress';
import { PARTNER_LOCATIONS } from '../util/constants';
import { loadPartnerData } from '../stores/partnerStore';
import Footer from '../components/footer';
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

  toggleDiv() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  render() {
    return (
      <div className="signup">
        <div className="onboarding-logo">
          <img alt="here is the logo" className="logo" src="assets/bglogo.png" />
        </div>
        <br />

        <h3>
          Trusted blockchain
          {' '}
          <br />
          {' '}
experts.
        </h3>

        {renderLocationInput(this.state.isSearchBoxVisible, this.state.showLocationRequiredHint)}
        {this.state.show && CircularProgress()}

        <Login
          pathname={this.props.location.pathname}
          onClick={saveAndContinue}
          locationId={this.locationId}
          showLocationRequired={this.showLocationRequired}
          showSearchBox={this.showSearchBox}
          history={this.props.history}
          toggleDiv={this.toggleDiv}
        />
        <br />
        <div className="raised-Btn">
          <RaisedButton
            className="Signup-btn"
            label="Sign up"
            backgroundColor="#43D676"
            fullWidth
            onClick={() => {
              this.props.history.push('register');
            }}
          />
        </div>
        <TermsAndPolicy />
        <Footer />
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
