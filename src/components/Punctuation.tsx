import React from 'react';

import './Punctuation.css';

interface PunctuationProps {
  char: string;
}

export default function Punctuation(props: PunctuationProps) {
  return (
    <div className='Punctuation'>
      <div className='Punctuation-top'>{props.char}</div>
      <div className='Punctuation-bottom'>{props.char}</div>
    </div>
  );
}
