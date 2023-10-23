import React, { FC } from 'react';

interface HeaderProps {
    children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
    return (
        <div className="page-header">
            <span className="page-header-text">
                {children}
            </span>
        </div>
    )
}

export default Header;