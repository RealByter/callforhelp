import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";

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

const nameValidations = {
    required: true,
    min: 2,
};
const emailValidations = {
    required: true,
    // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

const passwordValidations = {
    required: true,
    min: 8,
    pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
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
        <form onSubmit={handleSubmit(submitHandler)}>
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
            <button style={{ marginTop: "50px" }} type="submit">
                הרשם
            </button>
        </form>
    );
};

export default RegistrationForm;
