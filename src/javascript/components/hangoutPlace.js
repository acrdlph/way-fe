import React from 'react';

export default function HangoutPlace(props) {
  const { hangoutPlace, id, handleClick } = props;
  return (
    <div>
      <span>{`${hangoutPlace} `}</span>
      <span onClick={() => handleClick(id)}>
        <img src="assets/10-icon-remove.svg" alt="x to delete" />
      </span>
    </div>
  );
}
