import React from 'react';

const Badge = ({ children, color = 'green' }: any) => {
  const colors: Record<string, string> = {
    green: 'bg-[#21ff21]/30 text-[#21ff21] border-[#21ff21]',
    red: 'bg-red-900/30 text-red-400 border-red-900',
    blue: 'bg-blue-900/30 text-blue-400 border-blue-900',
    gray: 'bg-gray-800 text-gray-400 border-gray-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

export default Badge;

