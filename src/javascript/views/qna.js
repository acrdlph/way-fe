import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Button, Form, FormGroup, Label, Input, Row, Col,
} from 'reactstrap';
import Header from '../components/header.js';
import { loadQuestions, postQuestion } from '../stores/qnaStore';
import './qna.less';

class QnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.loadQuestions();
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }

  handleSubmit(event) {
    console.log(this.state.inputValue, 'dosto re pust');
    this.props.postQuestion({ content: this.state.inputValue });
    event.preventDefault();
    this.props.loadQuestions();
  }

  render() {
    return (
      <div className="qnaBody">
        <div className="formContainer">
          <Form className="formGroup" onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input
                type="textarea"
                onChange={this.handleChange}
                name="text"
                placeholder="What is your question to the Crypto Geeks community?"
                value={this.inputValue}
              />
            </FormGroup>
            <Button className="questionBtn">Ask a question</Button>
          </Form>
        </div>
        <div className="formLink">
          <div className="navLink">
            <NavLink to="/" activeClassName="active">
              All questions
            </NavLink>
            <NavLink to="/">Unanswered questions</NavLink>
            <NavLink to="/">Point</NavLink>
          </div>
        </div>
        <div className="formContainer">
          <div className="formGroup">
            <div className="headPost">
              <h4>
                If blockchain was truly revolutionary, why wouldn't top tech firms like Facebook,
                Amazon, Google, and Apple be doing more with it?
              </h4>
              <p>by Michael Gobatchow Aug 25.2018</p>
            </div>
            <div className="imgText">
              <div className="imgBox">
                <img />
              </div>
              <div className="nameUpdate">
                <h6>Jean-Marc Denis</h6>
                <p className="">answered 20 min ago - 5 updates</p>
              </div>
              <div className="question">
                <p>
                  It’s pretty much nothing more than a distributed permanent ledger system for
                  recording transactions. That’s it. It solves the same problem that having a
                  trusted broker, like Amazon, or E*Trade, or PayPal, or Visa, or a title company,
                  certify a transaction on your behalf solves. And fails to solve a lot of other
                  things brokers actually solve, as well.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions,
});

const mapDispatchToProps = dispatch => ({
  loadQuestions: () => dispatch(loadQuestions()),
  postQuestion: data => dispatch(postQuestion(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QnA);
