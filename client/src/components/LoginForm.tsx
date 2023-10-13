import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";
import "../styles/forms.scss";
import Errors from "./FormErrors";
import {
    passwordValidations,
    emailValidations,
} from "../constants/validationOptions";
type LoginFormProps = {
    onSubmit: ({ email: string, password: string }) => void;
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
    } = useForm<LoginFormI>({ criteriaMode: "all" });

    const submitHanlder = (data: LoginFormI) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(submitHanlder)} className="form">
            <FormField
                label="אימייל"
                inputType="text"
                inputProps={register("email", emailValidations)}
                inputClass={errors.email && "input-error"}
                hint={{ component: Errors("email", errors) }}
            />
            <FormField
                inputType="password"
                inputProps={register("password", passwordValidations)}
                inputClass={errors.password && "input-error"}
                label="סיסמא"
                hint={{ component: Errors("password", errors) }}
            />
            <button type="submit" className="form-submit-btn">
                התחבר
            </button>
        </form>
    );
};

export default LoginForm;
