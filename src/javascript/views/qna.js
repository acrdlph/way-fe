import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Header from '../components/header.js';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './qna.less';

class QnA extends React.Component {
  render() {
    return (
    <div className="qnaBody">
        <Form>
          <FormGroup>
            <Label for="exampleText">Text Area</Label>
            <Input type="textarea" name="text" id="exampleText" />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
    </div>
      );
  }
}

export default connect()(QnA);
