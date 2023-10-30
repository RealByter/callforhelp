import Button from './Button';
import { Dialog } from '@headlessui/react';
import ContactSelection from './ContactSelection';
import { useState } from 'react';

type ContactUsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const options: string[] = ['כללי', 'דיווח על תומך/נתמך', 'דיווח על בעיה', "הצעת פיצ'ר"];
export type Options = (typeof options)[number];

const ContactUsForm: React.FC<ContactUsProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState<Options>(options[0]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="contact-us-form-backdrop" onClick={onClose}>
      <Dialog.Panel className="contact-us-form-container">
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
        <form className="contact-form">
          <ContactSelection value={subject} onChange={setSubject} options={options} />
          <textarea />
          <Button>שליחה</Button>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ContactUsForm;
