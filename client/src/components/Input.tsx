import React, { InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldError, RegisterOptions } from 'react-hook-form';
import { ISigninFormValues, ISignupFormValues } from '../consts/formInputs';
import classes from '../styles/Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	formName: string;
	label: string;
	placeholder: string;
	error?: FieldError;
	register: UseFormRegister<ISignupFormValues | ISigninFormValues>;
	validationRules?: RegisterOptions<
		ISigninFormValues | ISignupFormValues,
		string
	>;
}

const Input: React.FC<InputProps> = ({
	label,
	placeholder,
	error,
	register,
	formName,
	validationRules,
	...rest
}) => {
	return (
		<div className={classes['input-container']}>
			<label htmlFor={formName} className={classes.label}>
				{label}
			</label>
			<input
				{...rest}
        dir="rtl"
				className={`${classes.input} ${error && classes.invalid}`}
				aria-invalid={error ? 'true' : 'false'}
				placeholder={placeholder}
				id={formName}
				{...register(formName, validationRules)}></input>
			{error && <p className={classes.error}>{error.message}</p>}
		</div>
	);
};

export default Input;
