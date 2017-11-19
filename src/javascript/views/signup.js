import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import _ from 'lodash';
import {supportedLocations} from '../util/constants';
import './signup.less';

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    const locationIdFromPath = _.get(this.props.match, 'params.locationId');
    const isValidLocation = locationIdFromPath && _.includes(supportedLocations, locationIdFromPath);
    this.state = {
      geolocationAvailable: false,
      geolocation: null,
      airport: isValidLocation ? locationIdFromPath : 'muc',
      waitingTime: 30
    };
    this.changeAirport = this.changeAirport.bind(this);
    this.changeWaitingTime = this.changeWaitingTime.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.getGeolocation = this.getGeolocation.bind(this);
    this.buildLocation = this.buildLocation.bind(this);
    this.renderLocationDropdown = this.renderLocationDropdown.bind(this);

    const userId = sessionStorage.getItem('userId');
    const locationId = sessionStorage.getItem('locationId');
    if(userId) {
      this.props.history.push(`/waitlist/${locationId}`); // user is onboarded already
    }
  }

  changeAirport(event, key, value) {
    this.setState({
      airport: value
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
    if (navigator.geolocation) {
      try {
        const location = await this.getGeolocation();
        console.log(location);
        this.setState({
          geolocationAvailable: true,
          geolocation: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          }
        });
      } catch(error) {
        console.log(error);
      }
    }
  }

  renderLocationDropdown() {
    this.buildLocation();
    if (!this.state.geolocationAvailable) {
      return (
        <div>
          <div>I am here</div>
          <DropDownMenu value={this.state.airport} onChange={this.changeAirport}>
            <MenuItem value={"ams"} primaryText="Amsterdam" />
            <MenuItem value={"muc"} primaryText="Munich" />
            <MenuItem value={"gva"} primaryText="Geneva" />
            <MenuItem value={"cph"} primaryText="Copenhagen" />
          </DropDownMenu>
        </div>
      );
    } else {
      return null;
    }
  }

  saveAndContinue() {
    console.log("Create user with: " + JSON.stringify(this.state));
    const body = JSON.stringify({
      'location': this.state.airport,
      'waiting_time': this.state.waitingTime,
      'geolocation': this.state.geolocation
    });
    const endpoint = 'api/users';
    fetch(endpoint, {
      method: 'post',
      body,
      headers: new Headers({
        'content-type': 'application/json'
      }),
    })
    .then((res) => res.json())
    .then((json) => {
      sessionStorage.setItem('userId', json.id);
      const locationId = json.location.toLowerCase();
      sessionStorage.setItem('locationId', locationId);
      this.props.history.push(`/waitlist/${locationId}`);
    });
  }

  render() {
    const {waitingTime} = this.state;
    return (
      <div className='signup'>

        <div>
          <img src='assets/airport-selection-icon.png' className='signup-selection-icon'/>
        </div>
        {this.renderLocationDropdown()}
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

        <RaisedButton label='Sign In' onClick={this.saveAndContinue}/>
      </div>
    );
  }
}
