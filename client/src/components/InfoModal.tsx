import React from 'react';
import Button from './Button';

type InfoModalProps = {
  title: string;
  subtext: string;
  children: React.ReactNode;
  onClose: () => void;
};

const InfoModal: React.FC<InfoModalProps> = ({ title, subtext, children, onClose }) => {
  return (
    <div className="info-modal">
      <div className="close-button" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none">
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
      </div>
      <h2 className="title">{title}</h2>
      <p className="subtext">{subtext}</p>
      <div className='info'>{children}</div>
      <Button className="continue-button" onClick={onClose}>
        הבנתי, אפשר להמשיך
      </Button>
    </div>
  );
};

export default InfoModal;
