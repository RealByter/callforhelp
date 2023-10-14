import { FieldValues } from 'react-hook-form';

export interface ISignupFormValues extends FieldValues {
  username: string;
  email: string;
  password: string;
}

export interface ISigninFormValues extends FieldValues {
  email: string;
  password: string;
}
