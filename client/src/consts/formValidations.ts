import { RegisterOptions } from 'react-hook-form';

export const nameSignupValidations: RegisterOptions = {
  required: 'יש להכניס שם',
  minLength: {
    value: 2,
    message: 'צריכים להיות לפחות 2 תווים'
  }
};

export const emailSigninValidations: RegisterOptions = {
  required: 'יש להכניס מייל'
};

export const emailSignupValidations: RegisterOptions = {
  required: 'יש להכניס מייל',
  pattern: {
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    message: 'מייל לא תקין'
  }
};

export const passwordSigninValidations: RegisterOptions = {
  required: 'יש להכניס סיסמא'
};

export const passwordSignupValidations: RegisterOptions = {
  required: 'יש להכניס סיסמא',
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
    message:
      'הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&,_)'
  },
  minLength: {
    value: 8,
    message: 'הסיסמא חייבת להכיל לפחות 8 תווים'
  }
};
