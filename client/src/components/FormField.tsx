import { useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

type TextInputProps = {
  label: string;
  inputType?: string;
  placeHolder?: string;
  inputProps?: UseFormRegisterReturn; // Should have the useForm register props
  inputClass?: string;
  error?: FieldError;
  disabled?: boolean;
  value?: string | null | undefined;
};

export default function FormField({
  label,
  inputType = 'text',
  inputProps,
  inputClass = '',
  placeHolder = label,
  error,
  value,
  disabled
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const effectiveInputType =
    inputType !== 'password' ? inputType : showPassword ? 'text' : 'password';

  return (
    <div className="input-container">
      <label htmlFor={inputProps && `input-${inputProps.name}`} className="label">
        {label}
      </label>
      <div className="input-wrapper">
        <input
          {...inputProps!}
          id={inputProps && `input-${inputProps?.name}`}
          disabled={disabled}
          dir="rtl"
          type={effectiveInputType}
          aria-invalid={error ? 'true' : 'false'}
          className={`form-input ${inputClass} ${error && 'invalid'}`}
          placeholder={placeHolder}
          style={inputType === 'password' ? { paddingLeft: '2.75rem' } : {}}
          {...(value ? { value } : {})} // A way to pass an attribute conditionally
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
      {error && (
        <p className="error" dir="rtl">
          {error.message}
        </p>
      )}
    </div>
  );
}
