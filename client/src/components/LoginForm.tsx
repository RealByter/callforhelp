import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";

type Props = {
    onSubmit: () => void;
};

interface LoginForm {
    name: string;
    email: string;
    password: string;
}

const nameValidations = {
    required: true,
    min: 2,
};
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
const LoginForm = (props: Props) => {
    const { onSubmit } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
                inputType="text"
                label="שם"
                inputProps={register("name", nameValidations)}
            />
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
