import React from 'react';
import {
  Button, Form, Input, Row, Col,
} from 'reactstrap';

import ReplyItem from './reply-item';
import returnDate from '../util/date';
import './question-item.less';

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replyValue: '', isHovering: true };

    this.handleChangeReply = this.handleChangeReply.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleChangeReply(event) {
    this.setState({ replyValue: event.target.value });
  }

  handleReplySubmit(event, id) {
    event.preventDefault();
    const userId = sessionStorage.getItem('userId');
    this.props.postReply({
      replied_by: userId,
      repl_content: this.state.replyValue,
      qId: id,
    });
    this.setState({ replyValue: '' });
  }

  handleMouseHover(show) {
    this.setState({ isHovering: true });
  }

  render() {
    const {
      id, question, deleteQuestion, deleteReply, handleChangeReply, replyValue,
    } = this.props;
    const {
      content, asked_by, asked_at, replies, _id,
    } = question;
    const user = sessionStorage.getItem('userId');

    return (
      <div
        onMouseEnter={() => this.handleMouseHover(true)}
        onMouseLeave={() => this.handleMouseHover(false)}
        className="formGroup"
      >
        <div className="headPost">
          <div className="titleWithX">
            <h4>{content}</h4>
            {this.state.isHovering
              && user === asked_by._id && (
                <div className="xhover" onClick={() => deleteQuestion(_id)}>
                  <img src="assets/10-icon-remove.svg" alt="x to delete" />
                </div>
            )}
          </div>
          <p>{`by ${asked_by.name} ・ ${returnDate(asked_at)}`}</p>
        </div>
        {replies.map(reply => (
          <ReplyItem key={reply._id} reply={reply} deleteReply={deleteReply} qId={_id} />
        ))}
        <div className="answerBtn" />
        <div className="replyContainer">
          <Form className="answerBox">
            <Input
              className="answerInput"
              onChange={this.handleChangeReply}
              name="text"
              placeholder={
                replies.length === 0 ? 'Be the first to reply...' : 'Any thoughts on that?'
              }
              value={this.state.replyValue}
            />
          </Form>
          <Button onClick={e => this.handleReplySubmit(e, _id)} className="replyBtn">
            Reply
          </Button>
        </div>
      </div>
    );
  }
}

export default QuestionItem;
