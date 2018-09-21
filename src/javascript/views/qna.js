import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import {
  postQuestion,
  deleteQuestion,
  postReply,
  deleteReply,
  loadQuestions,
} from '../stores/qnaStore';
import QuestionItem from '../components/question-item';
import sortDate from '../util/sort-date';
import './qna.less';

class QnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = { questionValue: '', questions: null };

    this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
    this.handleQuestionSubmit = this.handleQuestionSubmit.bind(this);
  }

  componentDidMount() {
    this.props.loadQuestions();
  }

  componentWillReceiveProps(props) {
    this.setState({ questions: props.questions.data });
  }

  handleChangeQuestion(event) {
    this.setState({ questionValue: event.target.value });
  }

  handleQuestionSubmit(event) {
    event.preventDefault();
    const userId = sessionStorage.getItem('userId');
    this.props.postQuestion({ asked_by: userId, content: this.state.questionValue });
    this.setState({ questionValue: '' });
  }

  render() {
    const custom_questions = [
      {
        _id: '5ba26df2bd7cbc29f8a3ffd2',
        asked_by: {
          _id: '5b6832c3bc24fa15f65b8f9a',
          username: '1234',
          name: 'Jean-Marc Denis',
        },
        content: 'zsefzsefsef',
        asked_at: '2018-09-19T15:40:34.411Z',
        upvotes: 0,
        __v: 1,
        replies: [
          {
            repl_content: 'zesfzesf',
            replied_at: '2018-09-19T15:40:38.086Z',
            repl_upvotes: 0,
            _id: '5ba26df6bd7cbc29f8a3ffd3',
            replied_by: [
              {
                _id: '5b6832c3bc24fa15f65b8f9a',
                username: '1234',
                name: 'Jean-Marc Denis',
              },
            ],
          },
        ],
      },
    ];
    const questionsList = sortDate(custom_questions, true);
    return (
      <div className="qnaBody">
        <div className="formContainer">
          <Form className="formGroup" onSubmit={this.handleQuestionSubmit}>
            <FormGroup>
              <Input
                type="textarea"
                onChange={this.handleChangeQuestion}
                name="text"
                placeholder="What is your question to the Crypto Geeks community?"
                value={this.state.questionValue}
              />
            </FormGroup>
            <Button className="questionBtn">Ask a question</Button>
          </Form>
        </div>
        <div className="formLink">
          <div className="navLink">
            <NavLink to="/qna" activeClassName="qnaActive">
              All questions
            </NavLink>
            <NavLink to="/qna/filtered">Unanswered questions</NavLink>
          </div>
        </div>
        <div className="formContainer">
          {this.props.location.pathname.includes('filtered')
            ? questionsList
              .filter(question => question.replies.length === 0)
              .map(question => (
                <QuestionItem
                  key={question._id}
                  question={question}
                  deleteQuestion={this.props.deleteQuestion}
                  handleChangeReply={this.handleChangeReply}
                  deleteReply={this.props.deleteReply}
                  handleReplySubmit={this.handleReplySubmit}
                  postReply={this.props.postReply}
                  loadQuestions={this.props.loadQuestions}
                />
              ))
            : questionsList.map(question => (
              <QuestionItem
                key={question._id}
                question={question}
                deleteQuestion={this.props.deleteQuestion}
                handleChangeReply={this.handleChangeReply}
                deleteReply={this.props.deleteReply}
                handleReplySubmit={this.handleReplySubmit}
                postReply={this.props.postReply}
                loadQuestions={this.props.loadQuestions}
              />
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  waitlist: state.waitlist,
  questions: state.questions,
});

const mapDispatchToProps = dispatch => ({
  postQuestion: data => dispatch(postQuestion(data)),
  deleteQuestion: qId => dispatch(deleteQuestion(qId)),
  postReply: data => dispatch(postReply(data)),
  deleteReply: data => dispatch(deleteReply(data)),
  loadQuestions: () => dispatch(loadQuestions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QnA);