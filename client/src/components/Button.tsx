import * as React from 'react';
import MuiButton from '@mui/material/Button';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'reset' | 'submit';
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  className,
  onClick
}: ButtonProps) => {
  return (
    <MuiButton
      type={type}
      variant="text"
      onClick={onClick}
      className={`generic-button ${className}`}>
      {children}
    </MuiButton>
  );
};

export default Button;
