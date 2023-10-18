import * as React from 'react';
import MuiButton from '@mui/material/Button';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }: ButtonProps) => {
  return (
    <MuiButton variant="text" className="generic-button" onClick={onClick}>
      {children}
    </MuiButton>
  );
};

export default Button;
