export const quickSignupErrors = {
  signUpWithGoogle: { title: 'שגיאה', content: 'אירעה שגיאה בעת התחברות עם גוגל' },
  signUpWithFacebook: { title: 'שגיאה', content: 'אירעה שגיאה בעת התחברות עם פייסבוק' }
};

export const signUpErrors = {
  userAlreadyExists: {
    title: 'המשתמש כבר קיים',
    content: 'אי אפשר ליצור יותר ממשתמש אחד עם אותו אימייל'
  },
  generalError: {
    title: 'שגיאה',
    content: 'אירעה שגיאה בעת הירשמות בעזרת אימייל'
  }
};

export const signInErrors = {
  invalidCredentials: {
    title: 'פרטים לא נכונים',
    content: 'לא נמצא משתמש עם האימייל והסיסמא הנתונים'
  },
  generalError: { title: 'שגיאה', content: 'אירעה שגיאה בעת התחברות באמצעות אימייל' }
};

export const FIREBASE_ERRORS = {
  alreadyExists: 'functions/already-exists',
  invalidArgument: { code: 'functions/invalid-argument', title: 'קלט לא תקין' },
  failedPrecondition: { code: 'functions/failed-precondition', title: 'שגיאת הרשאה' },
  notFound: 'auth/user-not-found',
  wrongPassword: 'auth/wrong-password',

const CONNECTION_ERROR_TEXT = {
  title: 'יש בעיות באינטרנט',
  content: 'וודא/י שהאינטרנט מחובר ונסה/י שוב'
};

export const connectionError = {
  refresh: {
    ...CONNECTION_ERROR_TEXT,
    refresh: true
  },
  continue: {
    ...CONNECTION_ERROR_TEXT,
    refresh: false
  }
};
