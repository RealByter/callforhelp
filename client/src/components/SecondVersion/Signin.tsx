import { SubmitHandler, useForm } from 'react-hook-form';
import { IPossibleFormValues } from '../../consts/formInputs';
import Input from './Input';
import FormWrapper from './FormWrapper';

const Signin: React.FC = () => {
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
        label="אימייל"
        type="email"
        register={register}
        formName="email"
        placeholder="הכנס אימייל"
        validationRules={{ required: { value: true, message: 'חובה למלא' } }}
        error={errors.email}
      />
      <Input
        label="סיסמא"
        type="password"
        register={register}
        formName="password"
        placeholder="הכנס סיסמא"
        validationRules={{ required: { value: true, message: 'חובה למלא' } }}
        error={errors.password}
      />
    </FormWrapper>
  );
};

export default Signin;
