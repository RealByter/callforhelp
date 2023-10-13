import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";
import {
    nameValidations,
    emailValidations,
    passwordValidations,
} from "../constants/validationOptions";

type RegistrationFormProps = {
    onSubmit: (userInfo: {
        name: string;
        email: string;
        password: string;
    }) => void;
};

interface RegistrationFormI {
    name: string;
    email: string;
    password: string;
}

const RegistrationForm = (props: RegistrationFormProps) => {
    const { onSubmit } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationFormI>();
    const submitHandler = React.useCallback(
        (data: RegistrationFormI) => {
            onSubmit(data);
        },
        [onSubmit]
    );
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="form">
            <FormField
                inputType="text"
                label="שם"
                inputProps={register("name", nameValidations)}
                inputClass={errors.name && "input-error"}
            />
            <FormField
                inputType="text"
                inputProps={register("email", emailValidations)}
                label="אימייל"
                inputClass={errors.email && "input-error"}
            />
            <FormField
                inputType="password"
                inputProps={register("password", passwordValidations)}
                label="סיסמא"
                inputClass={errors.password && "input-error"}
                hint="must be 2 letters"
            />
            {errors.name?.type === "required" && <p>Name is required</p>}
            {errors.email?.type === "required" && <p>Email is required</p>}
            {errors.password?.type === "required" && (
                <p>Password is required</p>
            )}
            {errors.email?.type === "pattern" && (
                <p>Email doesn't fit pattern</p>
            )}
            {errors.password?.type === "pattern" && (
                <p>Password doesn't fit pattern</p>
            )}
            <div className="form-helper">
                <p>הסיסמא לא מתאימה. הסיסמא צריכה לעמוד בתנאים הבאים</p>
                <ul>
                    <li>להכיל לפחות 8 תווים</li>
                    <li>להכיל אות קטנה אחת לפחות</li>
                    <li>להכיל אות גדולה אחת לפחות</li>
                </ul>
            </div>
            <button type="submit" className="form-submit-btn">
                הרשם
            </button>
        </form>
    );
};

export default RegistrationForm;
