import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import Form, { FormOptions } from '../components/Form';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile] = useUpdateProfile(auth);

  const handleFormSubmit = async ({ name, email, password }: FormOptions) => {
    const user = await createUserWithEmailAndPassword(email as string, password as string);
    if (user) {
      const success = await updateProfile({ displayName: name });
      if (success) {
        navigate('/');
      }
    }
  };

  return (
    <Form
      title="הרשמה עם אימייל"
      name
      password
      email
      onSubmit={handleFormSubmit}
      submitLabel="הרשמה"
    />
  );
};

export default SignUpPage;
