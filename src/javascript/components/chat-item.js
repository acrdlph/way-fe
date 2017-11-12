import React from 'react';
import {NavLink} from 'react-router-dom';
import {ListItem} from 'material-ui/List';

export default class ChatItem extends React.Component {
  render() {
    const {name, text, left} = this.props;
    const style = {
      backgroundColor: left ? '#55ff55' : '#5555ff'
    };

    return (
      <div style={style}>
        {name}: {text}
      </div>
    );
  }
}
