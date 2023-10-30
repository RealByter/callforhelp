import { Listbox } from '@headlessui/react';
import { Options } from './ContactUsForm';

type ContactSelectionProps = {
  value: string;
  onChange: (newValue: Options) => void;
  options: string[];
};

const ContactSelection: React.FC<ContactSelectionProps> = ({ value, onChange, options }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <Listbox.Label>נושא:</Listbox.Label>
      <Listbox.Button>{value}</Listbox.Button>
      <Listbox.Options>
        {options.map((option, index) => (
          <Listbox.Option key={index} value={option}>
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default ContactSelection;
