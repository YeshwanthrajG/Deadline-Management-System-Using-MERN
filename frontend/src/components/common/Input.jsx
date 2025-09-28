import React from 'react';

const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = ''
}) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`${baseClasses} ${className}`}
    />
  );
};

export default Input;
