import { FormEvent, useEffect, useState } from 'react';
import FormField from '../components/FormField';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, collections } from '../firebase/connection';
import { useNavigate } from 'react-router-dom';
import useLoadingContext from '../context/loading/useLoadingContext';
import { doc, updateDoc } from 'firebase/firestore';
import Button from '../components/Button';
import { FieldError } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { FIREBASE_ERRORS } from '../consts/errorMessages';
import useErrorContext from '../context/Error/useErrorContext';

const UserPage: React.FC = () => {
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();
  const setIsLoading = useLoadingContext();
  const setError = useErrorContext();
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        navigate('/');
      } else {
        setName(user.displayName!);
      }
    }
  }, [userLoading, user, navigate]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /* 
    Apparently you need to be on the Blaze plan (pay-as-you-go) in order to upload
    firebase functions to the cloud so for now i'm removing the precautions  
    */
    setIsLoading(true);
    await updateProfile(user!, {displayName: name});
    await updateDoc(doc(collections.users, user!.uid), {name});
    // try {
    //   const functions = getFunctions();
    //   const updateName = httpsCallable(functions, 'updateName');
    //   await updateName({ name });
    // } catch (e: unknown) {
    //   const error = e as { message: string; code: string };

    //   if (error.code === FIREBASE_ERRORS.invalidArgument.code) {
    //     setError({ title: FIREBASE_ERRORS.invalidArgument.title, content: error.message });
    //   } else if (error.code === FIREBASE_ERRORS.failedPrecondition.code) {
    //     setError({ title: FIREBASE_ERRORS.failedPrecondition.title, content: error.message });
    //   } else {
    //     setError({ title: 'שגיאה', content: 'אירעה שגיאה בעת שינוי שם' });
    //   }
    // }
    setIsLoading(false);
  };

  const nameIsValid = name.length >= 2 && name.length <= 40;

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

      <form onSubmit={submitHandler} className="form-wrapper">
        <FormField
          label="שם משתמש"
          value={name}
          onChange={(e: FormEvent<HTMLInputElement>) => {
            setName(e.currentTarget.value);
          }}
          error={
            !nameIsValid
              ? ({
                  message:
                    name.length < 2
                      ? 'צריכים להיות לפחות 2 תווים'
                      : 'אורך השם המקסימלי הוא 40 תווים'
                } as FieldError)
              : undefined
          }
        />
        <FormField label="אימייל" disabled value={user ? user.email : ''} />
        <Button
          type="submit"
          disabled={!user || !nameIsValid || name == user.displayName}
          className="submit-button">
          עדכן פרטים
        </Button>
      </form>
    </div>
  );
};

export default UserPage;
