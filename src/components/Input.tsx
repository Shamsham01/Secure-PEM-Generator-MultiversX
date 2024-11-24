import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`px-4 py-2 rounded-lg bg-gray-800 border border-purple-500/30 
        text-white focus:outline-none focus:ring-2 focus:ring-purple-500 
        focus:border-transparent transition-all ${className}`}
    />
  );
}