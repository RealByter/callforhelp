import { RegisterOptions } from 'react-hook-form';

export const nameSignupValidations: RegisterOptions = {
  required: 'יש להכניס שם',
  minLength: {
    value: 2,
    message: 'צריכים להיות לפחות 2 תווים'
  },
  maxLength: {
    value: 40,
    message: 'אורך השם המקסימלי הוא 40 תווים'
  }
};

export const emailSigninValidations: RegisterOptions = {
  required: 'יש להכניס מייל',
};

export const emailSignupValidations: RegisterOptions = {
  required: 'יש להכניס מייל',
  pattern: {
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    message: 'מייל לא תקין'
  },
  maxLength: {
    value: 254, // official max length
    message: 'אורך האימייל המקסימלי הוא 254 תווים'
  }
};

export const passwordSigninValidations: RegisterOptions = {
  required: 'יש להכניס סיסמא'
};

export const passwordSignupValidations: RegisterOptions = {
  required: 'יש להכניס סיסמא',
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/,
    message:
      'הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&,_)'
  },
  minLength: {
    value: 8,
    message: 'הסיסמא חייבת להכיל לפחות 8 תווים'
  },
  maxLength: {
    value: 128,
    message: 'הסיסמא לא יכולה להיות ארוכה מ-128 תווים'
  }
};
