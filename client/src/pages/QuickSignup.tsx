import LoginButton from '../components/LoginButton';
import classes from './QuickSignup.module.scss';
import GoogleLogo from '../assets/logo_googleg_48dp.svg';
import FacebookLogo from '../assets/FacebookLogo.png';
import MailLogo from '../assets/Mail.svg';
import OrBackground from '../assets/OrBackground.svg';

const QuickSignup: React.FC = () => {
  return (
    <div className={classes['temp-wrapper']}>
      <div className={classes.page}>
        <h1>הרשמה מהירה</h1>
        <div className={classes.social}>
          <LoginButton onClick={() => {}}>
            <img src={GoogleLogo} alt="Google Logo" />
            להרשמה עם גוגל
          </LoginButton>
          <LoginButton onClick={() => {}}>
            <img src={FacebookLogo} alt="Facebook Logo" width={25} height={24} />
            להרשמה עם פייסבוק
          </LoginButton>
        </div>
        <div className={classes.separator}>
          <div className={classes.line} />
          <div className={classes.or}>
            <span>או</span>
            <img src={OrBackground} alt='' />
          </div>
          <div className={classes.line} />
        </div>
        <LoginButton onClick={() => {}}>
          <img src={MailLogo} alt="Mail Logo" />
          להרשמה עם אימייל
        </LoginButton>
        <p dir="rtl">
          בהרשמתך הנך מתחייב שקראת את <span className={classes.highlight}>תנאי השימוש</span>
        </p>
        <p dir="rtl">
          כבר יש לך חשבון? <span className={classes.highlight}>להתחברות</span>
        </p>
      </div>
    </div>
  );
};

export default QuickSignup;
