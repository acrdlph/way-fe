import React from 'react';
import { Row } from 'reactstrap';

import returnDate from '../util/date';
import './reply-item.less';

class ReplyItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isHovering: false };

    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleMouseHover(show) {
    this.setState({ isHovering: show });
  }

  render() {
    const { reply, deleteReply, qId } = this.props;
    const { replied_by, replied_at, repl_content } = reply;
    const user = sessionStorage.getItem('userId');
    return (
      <div
        onMouseEnter={() => this.handleMouseHover(true)}
        onMouseLeave={() => this.handleMouseHover(false)}
        className="imgText"
      >
        <div className="imgNickname">
          <div className="imgBox">
            <img src="/assets/avatar-placeholder.png" />
          </div>
          <div className="nameUpdate">
            <div className="titleWithX">
              <h6>{replied_by[0].name}</h6>
              {this.state.isHovering
                && user === replied_by[0]._id && (
              <div className="xhover" onClick={() => deleteReply({ qId, rId: reply._id })}>x</div>
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
