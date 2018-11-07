import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import { TextField } from '@material-ui/core';


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
    this.state = { questionValue: '', questions: this.props.questions.data };

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
    const questionsList = sortDate(this.state.questions, true);
    return (
      <div className="qnaBody">
        <div className="formContainer">
          <form className="formGroup" onSubmit={this.handleQuestionSubmit}>
              <TextField
                className="textField"
                onChange={this.handleChangeQuestion}
                name="text"
                placeholder="Share your ideas, questions and upcoming events…"
                value={this.state.questionValue}
                InputProps={{ disableUnderline: true }}
                multiline={true}  
              />
            <button className="questionBtn">Post</button>
          </form>
        </div>
        <div className="formLink">
          <div className="navLink">
            <NavLink
              exact
              to="/qna"
              activeStyle={{ borderBottom: 'solid 3px #0095b3', paddingBottom: '1em' }}
            >
              All questions
            </NavLink>
            <NavLink
              exact
              to="/qna/filtered"
              activeStyle={{ borderBottom: 'solid 3px #0095b3', paddingBottom: '1em' }}
            >
              Unanswered questions
            </NavLink>
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
