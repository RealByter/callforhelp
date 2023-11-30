export const GENERAL_ERROR_MESSAGES = {
  missingCredentials: {
    hebrew: 'צריך אימייל, סיסמא ושם משתמש',
    english: 'The function requires an email, a password and a name: '
  },
  alreadyAuthenticated: {
    hebrew: 'אי אפשר להירשם בתור משתמש מחובר',
    english: 'The user must be unauthenticated in order to sign up: '
  },
  general: {
    hebrew: 'אירעה שגיאה בזמן יצירת המשתמש',
    english: 'An error occurred while creating the user: '
  }
};

export const PASSWORD_ERROR_MESSAGES = {
  regex: {
    hebrew:
      'הסיסמא צריכה להכיל לפחות אות קטנה אחת, אות גדולה אחת, מספר וסימן מיוחד (@,$,!,%,*,?,&,_)',
    english:
      'The password should include at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and one symbol from the following: @$!%*?&_: '
  },
  length: {
    hebrew: 'הסיסמא חייבת לכלול לפחות 8 תווים ולא יותר מ-20',
    english: 'The password should contain between 8 to 20 characters: '
  }
};

export const EMAIL_ERROR_MESSAGES = {
  regex: {
    hebrew: 'האימייל צריך להיות תקין',
    english: 'The email must be a valid address: '
  },
  alreadyExists: {
    english: 'The email address is already in use by another account.',
    hebrew: 'אי אפשר ליצור יותר ממשתמש אחד עם אותו אימייל'
  }
};

export const USERNAME_ERROR_MESSAGES = {
  length: {
    hebrew: 'השם צריך לכלול לפחות 2 אותיות',
    english: 'The name must include at least 2 characters: '
  }
};