import { FieldValues } from 'react-hook-form';

export interface IPossibleFormValues extends FieldValues {
  username?: string;
  email: string;
  password: string;
}

