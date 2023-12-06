import React from 'react';
import Button from './Button';
import Paragraph from './Paragraph';
import { NavLink } from 'react-router-dom';

type ChoiceProps = {
  paragraphText: string;
  text: string;
  to: string;
};

const Choice: React.FC<ChoiceProps> = ({ paragraphText, text, to }) => {
  return (
    <div className="choice">
      <Paragraph dir="rtl" isBold>
        {paragraphText}
      </Paragraph>
      <NavLink to={to} className="button-wrapper">
        <Button>{text}</Button>
      </NavLink>
    </div>
  );
};

export default Choice;
