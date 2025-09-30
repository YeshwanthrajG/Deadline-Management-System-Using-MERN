import React from 'react';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
    {...props}
  />
);

export default Input;
