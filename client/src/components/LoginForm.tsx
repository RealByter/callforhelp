import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";
import "../styles/forms.scss";
import {
    passwordValidations,
    emailValidations,
} from "../constants/validationOptions";
type LoginFormProps = {
    onSubmit: () => void;
};

interface LoginFormI {
    email: string;
    password: string;
}

const LoginForm = (props: LoginFormProps) => {
    const { onSubmit } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormI>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
            <FormField
                inputType="text"
                inputProps={register("email", {
                    ...emailValidations,
                })}
                label="אימייל"
            />
            <FormField
                inputType="password"
                inputProps={register("password", passwordValidations)}
                label="סיסמא"
            />
            <button type="submit">התחבר</button>
        </form>
    );
};

export default LoginForm;
