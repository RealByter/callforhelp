import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';

const SignInPage = () => {
  const navigate = useNavigate();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleFormSubmit = async ({ email, password }: FormOptions) => {
    const user = await signInWithEmailAndPassword(email as string, password as string);
    if (user) {
      navigate('/');
    }
  };

  return <Form title="התחברות" submitLabel="התחבר" email password onSubmit={handleFormSubmit} />;
};

export default SignInPage;
