import React from 'react';

export default function HangoutPlace(props) {
  const { hangoutPlace, id, handleClick } = props;
  return (
    <div>
      <span>{hangoutPlace}</span>
      <span onClick={() => handleClick(id)}> x</span>
    </div>
  );
}
