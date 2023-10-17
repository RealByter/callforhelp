import { emailValidations, nameValidations, passwordValidations } from '../consts/formValidations';
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
