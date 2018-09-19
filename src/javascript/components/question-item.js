import React from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import ReplyItem from './reply-item';
import returnDate from '../util/date';

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replyValue: '', isHovering: false };

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
    this.setState({ isHovering: show });
  }

  render() {
    const {
      id,
      question,
      deleteQuestion,
      handleReplySubmit,
      deleteReply,
      handleChangeReply,
      replyValue,
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
          <h4>{content}</h4>
          {this.state.isHovering
            && user === asked_by._id && <div onClick={() => deleteQuestion(_id)}>X</div>}
          <p>{`by ${asked_by.name} ・ ${returnDate(asked_at)}`}</p>
        </div>
        {replies.map(reply => (
          <ReplyItem key={reply._id} reply={reply} deleteReply={deleteReply} qId={_id} />
        ))}
        <div className="answerBtn" />
        <div className="formContainer">
          <Form className="formGroup" onSubmit={e => this.handleReplySubmit(e, _id)}>
            <FormGroup>
              <Input
                type="textarea"
                onChange={this.handleChangeReply}
                name="text"
                placeholder="You wanna answer to that motherfucker^?"
                value={this.state.replyValue}
              />
            </FormGroup>
            <Button className="questionBtn">Reply</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default QuestionItem;
