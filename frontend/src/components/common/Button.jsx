import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  className = '', 
  disabled = false,
  isLoading = false 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const primaryClasses = 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const classes = `${baseClasses} ${primaryClasses} ${disabled || isLoading ? disabledClasses : ''} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={classes}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
