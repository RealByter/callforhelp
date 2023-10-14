import React from "react";
import FormField from "./FormField";
import "../styles/forms.scss";
import { FieldErrors, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

type FormOptions = Partial<{
    name: string;
    email: string;
    password: string;
}>;

type FormProps = {
    onSubmit: (item: FormOptions) => void;
    submitLabel: string;
    name?: boolean;
    email?: boolean;
    password?: boolean;
};
type ValidationType = string | undefined;

const nameValidations = {
    required: "יש להכניס שם",
    minLength: {
        value: 2,
        message: "צריך להיות לפחות 2 תווים",
    },
};
const emailValidations = {
    required: "יש להכניס מייל",
    pattern: {
        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        message: "מייל לא תקין",
    },
};
const passwordValidations = {
    required: "יש להכניס סיסמא",
    validate: {
        oneLowercase: (value: ValidationType) =>
            value?.toUpperCase() !== value || "צריכה להכיל אות קטנה ",
        onUppercase: (value: ValidationType) =>
            value?.toLowerCase() !== value || "צריכה להכיל אות גדולה",
        oneNumber: (value: ValidationType) =>
            /\d/.test(value as string) || "צריכה להכיל מספר",
        specialCharacter: (value: ValidationType) =>
            /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(value as string) ||
            "צריכה להכיל סימן מיוחד",
    },
    minLength: {
        value: 8,
        message: "סיסמא צריכה להיות לפחות 8 תווים",
    },
};

const Errors = (name: string, errors: FieldErrors) => {
    return (
        <div className="form-helper">
            <ErrorMessage
                errors={errors}
                name={name}
                render={({ messages }) =>
                    messages &&
                    Object.entries(messages).map(([type, message]) => (
                        <p key={type}>{message}</p>
                    ))
                }
            />
        </div>
    );
};

const Form = (props: FormProps) => {
    const { onSubmit, name, email, password, submitLabel } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormOptions>({
        criteriaMode: "all",
    });
    const submitHandler = React.useCallback(
        (data: FormOptions) => {
            const dataToSubmit: FormOptions = {};
            if (name) {
                dataToSubmit.name = data.name;
            }
            if (email) {
                dataToSubmit.email = data.email;
            }
            if (password) {
                dataToSubmit.password = data.password;
            }
            onSubmit(dataToSubmit);
        },
        [onSubmit, name, email, password]
    );
    return (
        <>
            <form onSubmit={handleSubmit(submitHandler)} className="form">
                {name && (
                    <>
                        <FormField
                            inputType="text"
                            inputProps={register("name", nameValidations)}
                            label="שם"
                            inputClass={errors.email && "input-error"}
                            placeHolder="שם מלא"
                        />
                        {errors.name && Errors("name", errors)}
                    </>
                )}
                {email && (
                    <>
                        <FormField
                            inputType="text"
                            inputProps={register("email", emailValidations)}
                            label="אימייל"
                            inputClass={errors.email && "input-error"}
                        />
                        {errors.email && Errors("email", errors)}
                    </>
                )}
                {password && (
                    <>
                        <FormField
                            inputType="password"
                            inputProps={register(
                                "password",
                                passwordValidations
                            )}
                            label="סיסמא"
                            inputClass={errors.password && "input-error"}
                        />
                        {errors.password && Errors("password", errors)}
                    </>
                )}

                <button type="submit" className="form-submit-btn">
                    {submitLabel}
                </button>
            </form>
        </>
    );
};

export default Form;
