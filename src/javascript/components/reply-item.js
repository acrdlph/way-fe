import React from 'react';
import {
  Button, Row, Form, FormGroup, Input,
} from 'reactstrap';

const ReplyItem = (props) => {
  const { reply } = props;
  const { replied_by, replied_at, repl_content } = reply;
  return (
    <div className="imgText">
      <Row>
        <div className="imgBox">
          <img src="/assets/avatar-placeholder.png" />
        </div>
        <div className="nameUpdate">
          <h6>{replied_by.name}</h6>
          <p>{`answered ${replied_at} ago - 5 upvotes`}</p>
        </div>
      </Row>

      <div className="question">
        <Row>
          <p>{repl_content}</p>
        </Row>
        <img />
        <h4>Upvote</h4>
      </div>
    </div>
  );
};

export default ReplyItem;
