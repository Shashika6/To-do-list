import React from 'react';

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <div className="loading__text">{text}</div>
    </div>
  );
};

export default Loading; 