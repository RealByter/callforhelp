import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import classes from './Sign.module.scss';
const SignInPage = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);

  const handleFormSubmit = ({ email, password }: FormOptions) => {
    signInWithEmailAndPassword(email as string, password as string);
  };

  if (user) {
    navigate('/');
  }

  return (
    <div className={classes.outerContainer}>
      <h1 className={classes.header}>התחברות</h1>
      <div className={classes.formContainer}>
        <Form submitLabel="התחבר" email password onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};

export default SignInPage;
