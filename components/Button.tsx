import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-full font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-vallenato-red text-white hover:bg-red-700",
    secondary: "bg-vallenato-mustard text-vallenato-blue hover:bg-yellow-500",
    outline: "border-2 border-vallenato-blue text-vallenato-blue hover:bg-vallenato-blue hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;