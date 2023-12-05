import { useState } from 'react';
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
              <button
                className={`checkmark ${marked && 'marked'}`}
                type="button"
                onClick={() => setMarked((prev) => !prev)}>
                {marked ? (
                  <>
                    <svg
                      className="glow-border"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none">
                      <g filter="url(#filter0_d_556_1719)">
                        <rect
                          x="4.5"
                          y="4.5"
                          width="15"
                          height="15"
                          rx="1.5"
                          stroke="#0159FF"
                          shape-rendering="crispEdges"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_556_1719"
                          x="0"
                          y="0"
                          width="24"
                          height="24"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB">
                          <feFlood floodOpacity="0" result="BackgroundImageFix" />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.00416667 0 0 0 0 0.349389 0 0 0 0 1 0 0 0 0.5 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_556_1719"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_556_1719"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                    <svg
                      className='check'
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="10"
                      viewBox="0 0 11 10"
                      fill="none">
                      <path
                        d="M1 5.5L3.5 9L9.5 1"
                        stroke="#0159FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none">
                    <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#0E1C74" />
                  </svg>
                )}
              </button>
              בהרשמתך הנך מתחייב שקראת את{' '}
              <span onClick={() => setShowTerms(true)} tabIndex={0} className="highlighted">
                תנאי השימוש
              </span>
            </div>
          )}
          <Button type="submit" disabled={!marked} className="submit-button">
            {submitLabel}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;
