import React from 'react';
import { UseFormRegister, FieldError, RegisterOptions } from 'react-hook-form';
import { ISigninFormValues, ISignupFormValues } from '../consts/formInputs';

type InputProps = {
	formName: string;
	label: string;
	placeholder: string;
	error?: FieldError
	register: UseFormRegister<ISignupFormValues | ISigninFormValues>;
  validationRules?: RegisterOptions<ISigninFormValues | ISignupFormValues, string>
};

const Input: React.FC<InputProps> = ({
	label,
	placeholder,
	error,
	register,
	formName,
  validationRules
}) => {
	return (
		<div>
			<label htmlFor={formName}>{label}</label>
			<input
				placeholder={placeholder}
				id={formName}
				{...register(formName, validationRules)}></input>
			{error && <p>{error.message}</p>}
		</div>
	);
};

export default Input;
