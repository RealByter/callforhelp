import React from 'react';
import Button from './Button';
import Paragraph from './Paragraph';

type ChoiceProps = {
  paragraphText: string;
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Choice: React.FC<ChoiceProps> = ({ paragraphText, buttonText, onClick }) => {
  return (
    <div className="choice">
      <Paragraph dir="rtl" isBold>
        {paragraphText}
      </Paragraph>
      <div className="button-wrapper">
        <Button onClick={onClick}>{buttonText}</Button>
      </div>
    </div>
  );
};

export default Choice;
