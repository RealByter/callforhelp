import React, { FC } from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

const Header: FC<HeaderProps> = ({ children }) => {
  return <h1 className="page-header">{children}</h1>;
};

export default Header;
