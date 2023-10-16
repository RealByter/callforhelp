import classes from './LoginButton.module.scss';

type LoginButtonProps = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const LoginButton: React.FC<LoginButtonProps> = ({ children, onClick }) => {
  return (
    <button className={classes.button} onClick={onClick} dir="rtl">
      {children}
    </button>
  );
};

export default LoginButton;
