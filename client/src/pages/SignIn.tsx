import { FormEvent } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import classes from './SignIn.module.scss';
const SignInPage = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword, user] = useSignInWithEmailAndPassword(auth);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    signInWithEmailAndPassword(formData.get('email') as string, formData.get('password') as string);
  };

  const submitHandler = ({ email, password }: FormOptions) => {
    signInWithEmailAndPassword(email!, password!);
  };

  if (user) {
    navigate('/');
  }

  return (
    <div className={classes.signInContainer}>
      <h1 className={classes.signInHeader}>התחברות</h1>
      <Form submitLabel="התחבר" email password onSubmit={console.log} />
    </div>
  );
};

export default SignInPage;
