import React, { FC } from 'react';
import '../styles/header.scss';

interface HeaderProps {
    children: React.ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => {
    return (
        <div className="page-header">
            <span className="page-header-text">
                {children}
            </span>
        </div>
    )
}
