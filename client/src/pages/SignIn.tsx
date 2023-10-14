import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import classes from './SignIn.module.scss';
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
    <div className={classes.signInContainer}>
      <h1 className={classes.signInHeader}>התחברות</h1>
      <Form submitLabel="התחבר" email password onSubmit={handleFormSubmit} />
    </div>
  );
};

export default SignInPage;
