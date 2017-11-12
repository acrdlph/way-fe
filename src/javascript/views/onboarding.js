import React from 'react';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

export default class Onboarding extends React.Component {
  render() {
    return (
      <div style={{width: '400px'}}>
        <NavLink to="/signup">
          <RaisedButton label="Enter WaitList"/>
        </NavLink>
      </div>
    );
  }
}
