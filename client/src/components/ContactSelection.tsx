import { Listbox } from '@headlessui/react';
import { Options } from './ContactUsForm';

type ContactSelectionProps = {
  value: string;
  onChange: (newValue: Options) => void;
  options: string[];
};

const ContactSelection: React.FC<ContactSelectionProps> = ({ value, onChange, options }) => {
  return (
    <Listbox as={'div'} className="contact-selection" value={value} onChange={onChange}>
      <Listbox.Label className="label" dir="rtl">
        נושא:
      </Listbox.Label>
      <Listbox.Button className="button">
        {value}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="11"
          viewBox="0 0 19 11"
          fill="none">
          <path
            d="M17.9706 1.48528L9.48535 9.97056L1.00007 1.48528"
            stroke="#0E1C74"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Listbox.Button>
      <Listbox.Options className="options">
        {options.map((option, index) => (
          <Listbox.Option className="option" key={index} value={option}>
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default ContactSelection;
