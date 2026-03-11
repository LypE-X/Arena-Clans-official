import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button'
}: any) => {
  const base =
    'px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const styles = {
    primary: 'bg-brand-500 text-black hover:bg-brand-600 shadow-lg shadow-[#21ff21]/50',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-700',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: 'text-gray-400 hover:text-white'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant as keyof typeof styles]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

