import { FormEvent, useEffect, useState } from 'react';
import FormField from '../components/FormField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import useLoadingContext from '../context/loading/useLoadingContext';
import { doc, getDoc } from 'firebase/firestore';
import BackButton from '../components/BackButton';

const UserPage: React.FC = () => {
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const setIsLoading = useLoadingContext();
  const [name, setName] = useState<string | null>('');

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        navigate('/');
      } else {
        setName(user.displayName);
      }
    }
  }, [userLoading, user, navigate]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="user-page">
      <button
        className="back-button"
        onClick={() => {
          navigate(-1);
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="20"
          viewBox="0 0 11 20"
          fill="none">
          <path
            d="M9.48542 18.4853L1.00014 10L9.48542 1.51472"
            stroke="#0E1C74"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1>נתוני משתמש</h1>

      <form onSubmit={submitHandler}>
        <FormField label="שם משתמש" value={name} />
        <FormField label="אימייל" disabled value={user?.email} />
      </form>
    </div>
  );
};

export default UserPage;
