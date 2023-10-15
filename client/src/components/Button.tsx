import * as React from 'react';
import MuiButton from '@mui/material/Button';
import { buttonStyle } from '../consts/buttonStyle';

export interface ButtonProps {
    children: React.ReactNode
}

const Button: FC<ButtonProps> = ({ children }: ButtonProps) => {
    return (
        <MuiButton
            variant="text"
            sx={buttonStyle}>
            {children}
        </MuiButton>
    )
}

export default Button;;