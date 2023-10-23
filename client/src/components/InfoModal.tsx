import React from 'react';
import Button from './Button';

type InfoModalProps = {
  title: string;
  subtext: string;
  children: React.ReactNode;
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="close-button">
    <path
      d="M18 6L6 18"
      stroke="#0E1C74"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#0E1C74"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const InfoModal: React.FC<InfoModalProps> = ({ title, subtext, children }) => {
  return (
    <div className="info-modal">
      <CloseIcon />
      <h2 className="title">{title}</h2>
      <p className="subtext">{subtext}</p>
      {children}
      <Button className="continue-button">הבנתי, אפשר להמשיך</Button>
    </div>
  );
};

export default InfoModal;
