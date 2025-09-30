import React from 'react';

const Button = ({
  type = 'button',
  children,
  className = '',
  disabled = false,
  isLoading = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`px-4 py-2 rounded-xl font-semibold transition-all focus:outline-none shadow-md
      ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
      ${className}`}
    {...props}
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
        <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full"></span>
        <span>Loading...</span>
      </span>
    ) : (
      children
    )}
  </button>
);

export default Button;
