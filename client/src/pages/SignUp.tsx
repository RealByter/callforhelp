import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';
import Header from '../components/Header';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile] = useUpdateProfile(auth);

  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    console.log('here');
    
    const user = await createUserWithEmailAndPassword(email as string, password as string);
    if (user) {
      const success = await updateProfile({ displayName: name });
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <>
      <Header>הרשמה עם אימייל</Header>
      <Form name password email onSubmit={handleFormSubmit} submitLabel="להרשמה" />
    </>
  );
};

export default SignUpPage;
