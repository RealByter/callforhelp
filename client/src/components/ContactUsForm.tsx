import { MouseEventHandler } from 'react';

type ContactUsProps = {
  onClose: MouseEventHandler<HTMLDivElement | HTMLButtonElement | HTMLOrSVGElement>;
};

const ContactUsForm: React.FC<ContactUsProps> = ({ onClose }) => {
  return (
    <div className="contact-us-form-backdrop" onClick={onClose}>
      <div className="contact-us-form-container">
        <button className="close-button" onClick={onClose}>
          <svg
            onClick={onClose}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M18 6L6 18"
              stroke="#0E1C74"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#0E1C74"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContactUsForm;
