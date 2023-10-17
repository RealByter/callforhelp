import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/connection';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IPossibleFormValues } from '../../consts/formValidations';
import Input from './Input';
import FormWrapper from './FormWrapper';
import { useNavigate } from 'react-router-dom';

const Signin: React.FC = () => {
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IPossibleFormValues>();

  const submitHandler: SubmitHandler<IPossibleFormValues> = async (data) => {
    const user = await signInWithEmailAndPassword(data.email, data.password);
    if (user) {
      navigate('/');
    }
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
