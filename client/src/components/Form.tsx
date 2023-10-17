import FormField from './FormField';
import { useForm } from 'react-hook-form';

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
  title: string;
};
type ValidationType = string | undefined;

const nameValidations = {
  required: 'יש להכניס שם',
  minLength: {
    value: 2,
    message: 'צריך להיות לפחות 2 תווים'
  }
};
const emailValidations = {
  required: 'יש להכניס מייל',
  pattern: {
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    message: 'מייל לא תקין'
  }
};
const passwordValidations = {
  required: 'יש להכניס סיסמא',
  validate: {
    length: (value: ValidationType) => (value as string).length > 8 || 'צריכה להיות לפחות 8 תווים',
    oneLowercase: (value: ValidationType) =>
      value?.toUpperCase() !== value || 'צריכה להכיל אות קטנה ',
    onUppercase: (value: ValidationType) =>
      value?.toLowerCase() !== value || 'צריכה להכיל אות גדולה',
    oneNumber: (value: ValidationType) => /\d/.test(value as string) || 'צריכה להכיל מספר',
    specialCharacter: (value: ValidationType) =>
      /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value as string) || 'צריכה להכיל סימן מיוחד'
  }
};

const Form = ({ onSubmit, name, email, password, submitLabel, title }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormOptions>();

  return (
    <div className="wrapper">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {name && (
          <FormField
            inputType="text"
            inputProps={register('name', nameValidations)}
            label="שם"
            placeHolder="שם משתמש"
            error={errors.name}
          />
        )}
        {email && (
          <FormField
            inputType="text"
            inputProps={register('email', emailValidations)}
            label="אימייל"
            error={errors.email}
          />
        )}
        {password && (
          <FormField
            inputType="password"
            inputProps={register('password', passwordValidations)}
            label="סיסמא"
            inputClass={errors.password && 'input-error'}
            error={errors.password}
          />
        )}
        <button type="submit">{submitLabel}</button>
      </form>
    </div>
  );
};

export default Form;
