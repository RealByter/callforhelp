import { RegisterOptions } from 'react-hook-form';

export const nameValidations: RegisterOptions = {
  required: 'יש להכניס שם',
  minLength: {
    value: 2,
    message: 'צריכים להיות לפחות 2 תווים'
  }
};

export const emailValidations: RegisterOptions = {
  required: 'יש להכניס מייל',
  pattern: {
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    message: 'מייל לא תקין'
  }
};

export const passwordValidations: RegisterOptions = {
  required: 'יש להכניס סיסמא',
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&)'
  },
  minLength: {
    value: 8,
    message: 'הסיסמא חייבת להכיל לפחות 8 תווים'
  }
};
