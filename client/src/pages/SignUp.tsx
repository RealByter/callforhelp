import { FormEvent } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import classes from './SignUp.module.scss';
import Form from '../components/Form';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    createUserWithEmailAndPassword(
      formData.get('email') as string,
      formData.get('password') as string
    );
  };

  if (user) {
    navigate('/');
  }

  return (
    <div className={classes.outerContainer}>
      <h1>הרשמה עם מייל</h1>
      <Form name password email onSubmit={console.log} submitLabel="הרשמה" />
    </div>
  );
};

export default SignUpPage;
