import React from 'react';
import Button from './Button';

type InfoModalProps = {
  title: string;
  subtext: string;
  children: React.ReactNode;
};

const InfoModal: React.FC<InfoModalProps> = ({ title, subtext, children }) => {
  return (
    <div className="info-modal">
      <h2 className="title">{title}</h2>
      <p className="subtext">{subtext}</p>
      {children}
      <Button className="button">הבנתי, אפשר להמשיך</Button>
    </div>
  );
};

export default InfoModal;
