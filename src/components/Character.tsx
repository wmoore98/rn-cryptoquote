import React from 'react';

import './Character.css';

interface CharacterProps {
  topChar: string;
  bottomChar: string;
  onClick(bottomChar: string): void;
  isSelected: boolean;
}

export default function Character(props: CharacterProps) {
  const { topChar, bottomChar, onClick, isSelected } = props;

  const handleClick = () => {
    onClick(bottomChar);
  };

  return (
    <div
      className={`Character${isSelected ? ' Character--selected' : ''}`}
      onClick={handleClick}
    >
      <div>{topChar}</div>
      <div>{bottomChar}</div>
    </div>
  );
}
