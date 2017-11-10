import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {NavLink} from 'react-router-dom'

export default class Signup extends React.Component {
  render() {
    return (
      <div style={{width: '400px'}}>
        <DropDownMenu value={1} onChange={this.handleChange}>
          <MenuItem value={1} primaryText="Munich" />
          <MenuItem value={2} primaryText="Geneva" />
          <MenuItem value={3} primaryText="Copenhagen" />
        </DropDownMenu>
        <Slider defaultValue={0.5} />
        <NavLink to="/waitlist"><RaisedButton label='See who is waiting'/></NavLink>
      </div>
    );
  }
}
