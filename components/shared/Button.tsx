import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none px-4 py-2';
  
  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue/90 focus-visible:ring-brand-blue',
    secondary: 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus-visible:ring-gray-500',
  };

  const fullWidthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
