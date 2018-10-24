import React from 'react';
import Avatar from '@material-ui/core/Avatar';

import returnDate from '../util/date';
import './reply-item.less';

class ReplyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isHovering: true };

    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleMouseHover(show) {
    this.setState({ isHovering: true });
  }

  render() {
    const { reply, deleteReply, qId } = this.props;
    const { replied_by, replied_at, repl_content } = reply;
    const user = sessionStorage.getItem('userId');
    if (!replied_by[0].photo) {
      replied_by[0].photo = 'assets/32-icon-avatar.svg';
    }
    return (
      <div
        onMouseEnter={() => this.handleMouseHover(true)}
        onMouseLeave={() => this.handleMouseHover(false)}
        className="imgText"
      >
        <div className="imgNickname">
          <div className="imgBox">
            <Avatar className="replyAvatar" src={replied_by[0].photo} />
          </div>
          <div className="nameUpdate">
            <div className="titleWithX">
              <h6>{replied_by[0].name}</h6>
              {this.state.isHovering
                && user === replied_by[0]._id && (
                  <div className="xhover" onClick={() => deleteReply({ qId, rId: reply._id })}>
                    <img src="assets/10-icon-remove.svg" alt="x to delete" />
                  </div>
              )}
            </div>
            <p>{`answered ${returnDate(replied_at)} ago`}</p>
          </div>
        </div>

        <div className="question">
          <p>{repl_content}</p>
          <img />
        </div>
      </div>
    );
  }
}

export default ReplyItem;
