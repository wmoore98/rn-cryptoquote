import React from 'react';

import './Punctuation.css';

interface PunctuationProps {
  char: string;
}

export default function Punctuation(props: PunctuationProps) {
  return (
    <div className='Punctuation'>
      <div>{props.char}</div>
      <div>{props.char}</div>
    </div>
  );
}
