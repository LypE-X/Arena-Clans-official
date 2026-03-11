import React from 'react';

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-dark-800/50 border border-dark-800 backdrop-blur-sm rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

export default Card;

