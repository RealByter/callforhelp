import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import classes from './Sign.module.scss';
import Form, { FormOptions } from '../components/Form';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

  const handleFormSubmit = ({ email, password }: FormOptions) => {
    createUserWithEmailAndPassword(email as string, password as string);
  };

  if (user) {
    navigate('/');
  }

  return (
    <div className={classes.outerContainer}>
      <h1 className={classes.header}>הרשמה עם מייל</h1>
      <div className={classes.formContainer}>
        <Form name password email onSubmit={handleFormSubmit} submitLabel="הרשמה" />
      </div>
    </div>
  );
};

export default SignUpPage;
