import React from 'react';
import {
  Button, Row, Form, FormGroup, Input,
} from 'reactstrap';

import ReplyItem from './reply-item';

class QuestionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { replyValue: '' };

    this.handleChangeReply = this.handleChangeReply.bind(this);
    this.handleReplySubmit = this.handleReplySubmit.bind(this);
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

  render() {
    const {
      question, handleReplySubmit, handleChangeReply, replyValue,
    } = this.props;
    const {
      content, asked_by, asked_at, replies, _id,
    } = question;
    return (
      <div className="formGroup">
        <div className="headPost">
          <h4>{content}</h4>
          <p>{`by ${asked_by.name} ・ ${asked_at}`}</p>
        </div>
        {question.replies.map(reply => <ReplyItem key={reply._id} reply={reply} />)}
        <div className="answerBtn">
          <p>Show all 3 answer</p>
        </div>
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
