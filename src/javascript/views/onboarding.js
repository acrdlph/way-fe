import React from 'react';
import {Button} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'

export default class Onboarding extends React.Component {
  render() {
    return (
      <div style={{width: '400px'}}>
        <NavLink to="/signup"><Button>Enter WaitList</Button></NavLink>
      </div>
    );
  }
}
