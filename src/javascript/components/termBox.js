import React from 'react';
import '../views/signup.less';

function TermBox(props) {
  const { goToFeedback, history } = props;
  return (
    <div className="termsBoxcontainer">
      {console.log(history, 'ise parelthon')}
      <div className="termsBox">
        <p>
          By continuing, you agree to our
          {' '}
          {
            <a
              href="https://drive.google.com/file/d/1qmGuCI59X8EW-pDcvRhMDCZaa1D4_nGd/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
          }
          ,
          {' '}
          {
            <a
              href="https://drive.google.com/file/d/1WjTFH8rs3GjA3DQlNOr6uvBCyUIhBNCS/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          }
          {' '}
          &
          {' '}
          <a
            href="https://drive.google.com/file/d/13TAmIv_EXfVHHkV9W3fY8AKr7hadcupf/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cookie use.
          </a>
        </p>
        <p>
          Powered by
          {' '}
          <a href="https://www.way.network/" target="_blank" rel="noopener noreferrer">
            Way Network
            {' '}
          </a>
          <a className="legal" onClick={() => history.push('/legalNotice')}>
            {' '}
            · Legal Notice
            {' '}
          </a>
          {' '}
          ·
          <a onClick={goToFeedback} className="feedback-handler">
            {' '}
            Feedback
            {' '}
          </a>
        </p>
      </div>
    </div>
  );
}

export default TermBox;
