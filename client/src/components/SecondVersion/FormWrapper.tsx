import classes from '../../styles/FormWrapper.module.scss';

type FormWrapperProps = {
  title: string;
  submitText: string;
  children: React.ReactNode;
  onSubmit: () => void;
};

const FormWrapper: React.FC<FormWrapperProps> = ({ title, submitText, children, onSubmit }) => {
  return (
    <div className={classes.wrapper}>
      <h1>{title}</h1>
      <form className={classes.form} onSubmit={onSubmit}>
        {children}
        <button type="submit">{submitText}</button>
      </form>
    </div>
  );
};

export default FormWrapper;
