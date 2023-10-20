import React from 'react';
import Paragraph from './Paragraph';
import Button from './Button';

type ErrorModalProps = {
  title: string;
  content: string;
  onClose: () => void;
};

const ErrorModal: React.FC<ErrorModalProps> = ({ title, content, onClose }) => {
  return (
    <div className="error-modal">
      <h2>{title}</h2>
      <Paragraph isBold dir={'rtl'}>
        {content}
      </Paragraph>
      <Button type="button" onClick={onClose}>
        המשך
      </Button>
    </div>
  );
};

export default ErrorModal;
