import * as React from 'react';
import MuiButton from '@mui/material/Button';

export interface ButtonProps {
  type?: string;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, type = 'button', className }: ButtonProps) => {
  return (
    <MuiButton itemType={type} variant="text" className={`generic-button ${className}`}>
      {children}
    </MuiButton>
  );
};

export default Button;
