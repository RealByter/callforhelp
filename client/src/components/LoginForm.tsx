import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";

type LoginFormProps = {
    onSubmit: () => void;
};

interface LoginFormI {
    email: string;
    password: string;
}
const emailValidations = {
    required: true,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
};

const passwordValidations = {
    required: true,
    min: 8,
    pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
const LoginForm = (props: LoginFormProps) => {
    const { onSubmit } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormI>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
                inputType="text"
                inputProps={register("email", emailValidations)}
                label="אימייל"
            />
            <FormField
                inputType="text"
                inputProps={register("password", passwordValidations)}
                label="סיסמא"
            />
            <button type="submit">התחבר</button>
        </form>
    );
};

export default LoginForm;
