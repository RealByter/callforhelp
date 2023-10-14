import React, { InputHTMLAttributes, useState } from 'react';
import { UseFormRegister, FieldError, RegisterOptions } from 'react-hook-form';
import { ISigninFormValues, ISignupFormValues } from '../consts/formInputs';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
	const [showPassword, setShowPassword] = useState(false);

	const { type } = rest;

	let actualType = type;
	if (type === 'password') {
		actualType = showPassword ? 'text' : 'password';
	}

	return (
		<div className={classes['input-container']}>
			<label htmlFor={formName} className={classes.label}>
				{label}
			</label>
			<div className={classes['input-wrapper']}>
				<input
					{...rest}
					dir="rtl"
					type={actualType}
					className={`${classes.input} ${error && classes.invalid}`}
					aria-invalid={error ? 'true' : 'false'}
					placeholder={placeholder}
					id={formName}
					{...register(formName, validationRules)}></input>
				{type === 'password' && (
					<button onClick={() => setShowPassword(prev => !prev)}>
						{showPassword ? (
							<VisibilityOffOutlinedIcon htmlColor="#304571" />
						) : (
							<VisibilityOutlinedIcon htmlColor="#304571" />
						)}
					</button>
				)}
			</div>
			{error && <p className={classes.error}>{error.message}</p>}
		</div>
	);
};

export default Input;
