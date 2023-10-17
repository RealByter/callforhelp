import { useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

type TextInputProps = {
  label: string;
  inputType?: string;
  placeHolder?: string;
  inputProps: UseFormRegisterReturn; // Should have the useForm register props
  inputClass?: string;
  error?: FieldError;
};

export default function FormField({ label, inputType = 'text', inputProps, inputClass = '', placeHolder = label, error }: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const effectiveInputType =
    inputType !== 'password' ? inputType : showPassword ? 'text' : 'password';

  return (
    <div className="input-container">
      <label htmlFor={`input-${inputProps.name}`} className='label'>{label}</label>
      <div className="input-wrapper">
        <input
          {...inputProps!}
          id={`input-${inputProps.name}`}
          dir="rtl"
          type={effectiveInputType}
          aria-invalid={error ? 'true' : 'false'}
          className={`form-input ${inputClass} ${error && 'invalid'}`}
          placeholder={placeHolder}
          style={inputType === 'password' ? { paddingLeft: '2.75rem' } : {}}
        />
        {inputType === 'password' && (
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <VisibilityOffOutlinedIcon htmlColor="#304571" />
            ) : (
              <VisibilityOutlinedIcon htmlColor="#304571" />
            )}
          </button>
        )}
      </div>
      {error && <p className='error'>{error.message}</p>}
    </div>
  );
}
