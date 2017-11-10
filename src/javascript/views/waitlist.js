import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import Profile from '../components/profile';
import WaitListItem from '../components/waitlist-item';

export default class WaitList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onTheList: [
        {
          name: "Brendan Lim",
          interests: "I am just waiting here...",
          timeLeft: 50
        },
        {
          name: "Eric Hoffman",
          interests: "Anyone wants to drink a coffee with me?",
          timeLeft: 80
        }
      ]
    };
  }

  render() {
    const onTheList = this.state.onTheList;
    const list = [];
    _.each(onTheList, entry => {
      list.push(
        <WaitListItem interests={entry.interests}/>
      );
    });

    return (
      <div style={{width: '400px'}}>
        <Profile/>
        <List>
          {list}
        </List>
      </div>
    );
  }
}
