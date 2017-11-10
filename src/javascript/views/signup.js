import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom'
import fetch from 'isomorphic-fetch'

export default class Signup extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      airport: 'MUC',
      waitingTime: 30
    };
    this.changeAirport = this.changeAirport.bind(this);
    this.changeWaitingTime = this.changeWaitingTime.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
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
    const body = this.state;
    const endpoint = 'http://localhost:8000/signup';
    fetch(endpoint, {
      method: 'post',
      body,
      headers: new Headers({
        'content-type': 'application/json'
      }),
    })
    .then(() => {
      this.props.history.push("/waitlist");
    });
  }

  render() {
    const {waitingTime} = this.state;
    return (
      <div style={{width: '400px'}}>
        <DropDownMenu value={"MUC"} onChange={this.changeAirport}>
          <MenuItem value={"MUC"} primaryText="Munich" />
          <MenuItem value={"GVA"} primaryText="Geneva" />
          <MenuItem value={"CPH"} primaryText="Copenhagen" />
        </DropDownMenu>
        <Slider
          min={15}
          max={300}
          defaultValue={30}
          onChange={this.changeWaitingTime}
        />
        <div>Waiting time: {waitingTime} minutes.</div>
        <RaisedButton label='See who is waiting' onClick={this.saveAndContinue}/>
      </div>
    );
  }
}
