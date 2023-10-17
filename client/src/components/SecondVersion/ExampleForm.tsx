import { SubmitHandler, useForm } from 'react-hook-form';
import { IPossibleFormValues } from '../../consts/formValidations';
import Input from './Input';
import classes from '../../styles/ExampleForm.module.scss';

const ExampleForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IPossibleFormValues>();

  const submitHandler: SubmitHandler<IPossibleFormValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={classes['example-form']}>
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
      <button type="submit">הגש</button>
    </form>
  );
};

export default ExampleForm;
