import React from 'react';
import {Button} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'

export default class Onboarding extends React.Component {
  render() {
    return (
      <div>
        <NavLink to="/signup"><Button>Enter WaitList</Button></NavLink>
      </div>
    );
  }
}
