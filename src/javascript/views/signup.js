import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom';
import fetch from 'isomorphic-fetch';
import {Row, Col} from 'react-bootstrap';
import './signup.less';

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      airport: 'MUC',
      waitingTime: 30
    };
    this.changeAirport = this.changeAirport.bind(this);
    this.changeWaitingTime = this.changeWaitingTime.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);

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

  saveAndContinue() {
    console.log("Create user with: " + JSON.stringify(this.state));
    const body = JSON.stringify({
      'location': this.state.airport,
      'waiting_time': this.state.waitingTime
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
      <div>
        <img src='assets/join-the-waitlist.png' className='signupHeader'/>


  <Row>
    <Col xs={2} md={2}>
      <img src='assets/airport-selection-icon.png' className='selectionIcon'/>
    </Col>
    <Col xs={10} md={10}>
      <DropDownMenu value={this.state.airport} onChange={this.changeAirport}>
        <MenuItem value={"MUC"} primaryText="Munich" />
        <MenuItem value={"GVA"} primaryText="Geneva" />
        <MenuItem value={"CPH"} primaryText="Copenhagen" />
      </DropDownMenu>
    </Col>

    <Col xs={12} md={12} className="spacerSmall"/>

    <Col xs={2} md={2}>
      <img src='assets/waiting-time-selection-icon.png' className='selectionIcon'/>
    </Col>
    <Col xs={10} md={10}>
      I need to wait {waitingTime} minutes.
      <div style={{width: '200px'}}>
        <Slider
          min={20}
          max={300}
          step={10}
          defaultValue={30}
          onChange={this.changeWaitingTime}
        />
      </div>

    </Col>
  </Row>


        <RaisedButton label='See who else is waiting' onClick={this.saveAndContinue}/>
      </div>
    );
  }
}
