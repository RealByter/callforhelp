import { SubmitHandler, useForm } from 'react-hook-form';
import { IPossibleFormValues } from '../../consts/formInputs';
import Input from './Input';
import FormWrapper from './FormWrapper';

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IPossibleFormValues>();

  const submitHandler: SubmitHandler<IPossibleFormValues> = (data) => {
    console.log(data);
  };

  return (
    <FormWrapper title="התחברות" submitText="כניסה" onSubmit={handleSubmit(submitHandler)}>
      <Input
        label="שם משתמש"
        type="text"
        register={register}
        formName="username"
        placeholder="הכנס שם משתמש"
        validationRules={{
          required: { value: true, message: 'חובה למלא' },
          minLength: { value: 2, message: 'השם חייב לכלול לפחות 2 תווים' }
        }}
        error={errors.username}
      />
      <Input
        label="אימייל"
        type="email"
        register={register}
        formName="email"
        placeholder="הכנס אימייל"
        validationRules={{
          required: { value: true, message: 'חובה למלא' },
          pattern: {
            value: /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/,
            message: 'אימייל לא אמיתי'
          }
        }}
        error={errors.email}
      />
      <Input
        label="סיסמא"
        type="password"
        register={register}
        formName="password"
        placeholder="הכנס סיסמא"
        validationRules={{
          required: { value: true, message: 'חובה למלא' },
          pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            message: 'לסיסמא צריך להיות כזה וכזה'
          },
          minLength: { value: 8, message: 'סיסמא קצרה מדי' }
        }}
        error={errors.password}
      />
    </FormWrapper>
  );
};

export default Signup;
