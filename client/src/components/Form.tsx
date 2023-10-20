import React, { useState } from 'react';
import {
  nameSignupValidations,
  emailSigninValidations,
  emailSignupValidations,
  passwordSigninValidations,
  passwordSignupValidations
} from '../consts/formValidations';
import Button from './Button';
import FormField from './FormField';
import { useForm } from 'react-hook-form';
import TermsAndConditionsPopup from './TermsAndConditionsPopup';

export type FormOptions = Partial<{
  name: string;
  email: string;
  password: string;
}>;

type FormProps = {
  onSubmit: (item: FormOptions) => void;
  submitLabel: string;
  name?: boolean;
  email?: boolean;
  password?: boolean;
};

const Form = ({ onSubmit, name, email, password, submitLabel }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormOptions>();
  const [marked, setMarked] = useState(!name);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      {showTerms && <TermsAndConditionsPopup onClose={() => setShowTerms(false)} />}
      <div className="form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {name && (
            <FormField
              inputType="text"
              inputProps={register('name', nameSignupValidations)}
              label="שם"
              placeHolder="שם משתמש"
              error={errors.name}
            />
          )}
          {email && (
            <FormField
              inputType="text"
              inputProps={register('email', name ? emailSignupValidations : emailSigninValidations)}
              label="אימייל"
              error={errors.email}
            />
          )}
          {password && (
            <FormField
              inputType="password"
              inputProps={register(
                'password',
                name ? passwordSignupValidations : passwordSigninValidations
              )}
              label="סיסמא"
              inputClass={errors.password && 'input-error'}
              error={errors.password}
            />
          )}
          {name && (
            <div className="container">
              בהרשמתך הנך מתחייב שקראת את{' '}
              <span onClick={() => setShowTerms(true)} tabIndex={0} className="highlighted">
                תנאי השימוש
              </span>
              <button
                className={`checkmark ${marked && 'marked'}`}
                type="button"
                onClick={() => setMarked((prev) => !prev)}></button>
            </div>
          )}
          <Button type="submit" disabled={!marked}>
            {submitLabel}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;
