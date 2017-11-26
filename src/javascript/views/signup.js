import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import _ from 'lodash';
import {supportedLocations} from '../util/constants';
import Infobox from '../components/infobox';
import {loadPartnerData} from '../stores/partnerStore';
import './signup.less';

let geolocationAvailable = false;

class Signup extends React.Component {

  constructor(props) {
    super(props);
    const locationIdFromPath = _.get(this.props.match, 'params.locationId');
    // TODO make this validation using partner api
    const isValidLocation = locationIdFromPath && _.includes(supportedLocations, locationIdFromPath);

    this.changeAirport = this.changeAirport.bind(this);
    this.changeWaitingTime = this.changeWaitingTime.bind(this);
    this.save = this.save.bind(this);
    this.update = this.update.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.getGeolocation = this.getGeolocation.bind(this);
    this.buildLocation = this.buildLocation.bind(this);
    this.renderLocationInput = this.renderLocationInput.bind(this);

    const userId = sessionStorage.getItem('userId');
    const locationId = sessionStorage.getItem('locationId');
    if(userId) {
      this.props.history.push(`/waitlist/${locationId}`); // user is onboarded already
    }
    this.props.loadPartnerData();
    this.state = {
      showLocationRequiredHint: false,
      geolocation: null,
      airport: isValidLocation ? locationIdFromPath : null,
      waitingTime: 30
    };
  }

  componentDidMount() {
    this.buildLocation();
  }

  changeAirport(event) {
    this.setState({
      airport: event ? event.value : null
    });
  }

  changeWaitingTime(event, value) {
    this.setState({
      waitingTime: Math.floor(value)
    });
  }

  getGeolocation() {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, {});
    });
  }

  async buildLocation() {
    if (navigator.geolocation && !geolocationAvailable) {
      try {
        const location = await this.getGeolocation();
        console.log(location);
        geolocationAvailable = true;
        const body = JSON.stringify({
          geolocation: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }
        });
        this.save(body);
      } catch(error) {
        console.log(error);
      }
    }
  }

  async save(body) {
    console.log("Create user with: " + JSON.stringify(this.state));
    const endpoint = 'api/users';
    const res = await fetch(endpoint, {
      method: 'post',
      body,
      headers: new Headers({
        'content-type': 'application/json'
      }),
    });
    const resJson = await res.json();
    this.setState({
      airport: resJson.location
    });
    sessionStorage.setItem('userId', resJson.id);
    return resJson;
  }

  async update(body) {
    console.log("Update user with: " + JSON.stringify(this.state));
    const userId = sessionStorage.getItem('userId');
    const endpoint = 'api/users/' + userId;
    const res = await fetch(endpoint, {
      method: 'put',
      body,
      headers: new Headers({
        'content-type': 'application/json'
      }),
    });
    const resJson = await res.json();
    return resJson;
  }

  async saveAndContinue() {
    if (!this.state.airport) {
      this.setState({
        showLocationRequiredHint: true
      });
      return;
    }
    const body = JSON.stringify({
      'location': this.state.airport,
      'waiting_time': this.state.waitingTime
    });
    // if geolocationAvailable then we have already saved the user then update
    let json = {};
    if (!geolocationAvailable) {
      json = await this.save(body);
    } else {
      json = await this.update(body);
    }
    const locationId = json.location.toLowerCase();
    sessionStorage.setItem('locationId', locationId);
    this.props.history.push(`/waitlist/${locationId}`);
  }

  renderLocationInput() {
    // TODO move this to a component
    const locationList = [];
    _.each(this.props.partners.data, (entry, key) => {
      locationList.push(
        {
          value: entry.uniqueKey,
          label: entry.name
        }
      );
    });
    return (
      <div style={{paddingBottom: '15px'}}>
        <div>
          <img src='assets/airport-selection-icon.png' className='signup-selection-icon'/>
        </div>
        <p>I'm waiting @</p>
        <Infobox
          visible={this.state.showLocationRequiredHint}
          text={'Please enter your location first to join the waitlist'}
        />
        <Select
          name="waiting-location"
          value={this.state.airport}
          onChange={this.changeAirport}
          options={locationList}
        />
      </div>
    );
  }

  render() {
    const {waitingTime} = this.state;
    return (
      <div className='signup'>
        {this.renderLocationInput()}
        <div>
          <img src='assets/waiting-time-selection-icon.png' className='signup-selection-icon'/>
        </div>

        <div>
          <div>I need to wait {waitingTime} minutes.</div>
          <div className='signup-slider'>
            <Slider
              min={20}
              max={300}
              step={10}
              defaultValue={30}
              onChange={this.changeWaitingTime}
            />
          </div>
        </div>

        <RaisedButton
          label='Sign In'
          backgroundColor='#ffd801'
          onClick={this.saveAndContinue}
        />

        <p className='signup-legal-texts'>
          By proceeding, you agree to our{' '}
          <a href='https://s3.eu-central-1.amazonaws.com/waitlist-assets/Terms_of_Use.pdf'>Terms of Use</a>{' '}&{' '}
          <a href='https://s3.eu-central-1.amazonaws.com/waitlist-assets/Privacy_Policy.pdf'>Privacy Policy</a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    partners: state.partners
  };
};

const mapDispatchToProps = dispatch => ({
  loadPartnerData: () => dispatch(loadPartnerData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
