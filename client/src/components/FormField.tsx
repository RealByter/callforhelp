import React from 'react';
import Eye from '../assets/eye.svg';
import NoShowEye from '../assets/eye-slash.svg';
import classes from './FormField.module.scss';
import { UseFormRegisterReturn } from 'react-hook-form';

type TextInputProps = {
  label: string;
  inputType?: string;
  placeHolder?: string;
  inputProps: UseFormRegisterReturn; // Should have the useForm register props
  inputClass?: string;
};

export default function FormField(props: TextInputProps) {
  const { label, inputType = 'text', inputProps, inputClass = '', placeHolder = label } = props;
  const [shown, setShown] = React.useState(inputType !== 'password');
  const toggleShown = () => {
    setShown((prev) => !prev);
  };
  const eye = shown ? NoShowEye : Eye;
  const effectiveInputType = inputType !== 'password' ? inputType : shown ? 'text' : 'password';
  return (
    <div className={classes['form-field']}>
      <label htmlFor={`input-${inputProps.name}`}>{label}</label>
      <div className={classes['form-field-input-container']}>
        <input
          {...inputProps!}
          id={`input-${inputProps.name}`}
          type={effectiveInputType}
          className={`${classes['form-field-input']} ${inputClass}`}
          placeholder={placeHolder}
        />
        {inputType === 'password' && (
          <img
            className={classes['form-field-eye']}
            width={24}
            height={24}
            src={eye}
            onClick={toggleShown}
          />
        )}
      </div>
    </div>
  );
}
