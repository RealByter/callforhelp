import * as React from 'react';
import MuiButton from '@mui/material/Button';
import "../styles/button.scss"

export interface ButtonProps {
    children: React.ReactNode
}

const Button: FC<ButtonProps> = ({ children }: ButtonProps) => {
    return (
        <MuiButton
            variant="text"
            className="generic-button">
            {children}
        </MuiButton>
    )
}

export default Button;;