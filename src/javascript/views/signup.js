import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import _ from 'lodash';
import {supportedLocations} from '../util/constants';
import {loadPartnerData} from '../stores/partnerStore';
import './signup.less';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    const locationIdFromPath = _.get(this.props.match, 'params.locationId');
    const isValidLocation = locationIdFromPath && _.includes(supportedLocations, locationIdFromPath);
    
    this.changeAirport = this.changeAirport.bind(this);
    this.changeWaitingTime = this.changeWaitingTime.bind(this);
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
      geolocationAvailable: false,
      geolocation: null,
      airport: isValidLocation ? locationIdFromPath : 'MUC',
      waitingTime: 30
    };
  }

  changeAirport(event, selectedIndex) {
    this.setState({
      airport: event.value
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

  renderLocationInput() {
    this.buildLocation();
    if (!this.state.geolocationAvailable) {
      const locationList = [];
      _.each(this.props.partners.data, (entry, key) => {
        locationList.push(
          {
            value: entry.uniqueKey, 
            text: entry.name
          }
        );
      });
      return (
        <div>
          <div>
            <img src='assets/airport-selection-icon.png' className='signup-selection-icon'/>
          </div>
          <AutoComplete
            floatingLabelText="I'm waiting @"
            openOnFocus={true}
            hintText="Enter your current location"
            filter={AutoComplete.caseInsensitiveFilter}
            onNewRequest={this.changeAirport}
            textFieldStyle={{textAlign: 'center'}}
            dataSource={locationList}
          />
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

        <RaisedButton label='Sign In' onClick={this.saveAndContinue}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    partners: state.partners
  }
};

const mapDispatchToProps = dispatch => ({
  loadPartnerData: () => dispatch(loadPartnerData())
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);