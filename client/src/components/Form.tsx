import React from "react";
import FormField from "./FormField";
import "../styles/forms.scss";
import { useForm } from "react-hook-form";
// import Errors from "./FormErrors";
import { ErrorMessage } from "@hookform/error-message";
import {
    nameValidations,
    emailValidations,
    passwordValidations,
} from "../constants/validationOptions";

type FormOptions = Partial<{
    name: string;
    email: string;
    password: string;
}>;

type FormProps = {
    title: string;
    onSubmit: (item: FormOptions) => void;
    submitLabel: string;
    name?: boolean;
    email?: boolean;
    password?: boolean;
};

const Form = (props: FormProps) => {
    const { onSubmit, name, email, password, title, submitLabel } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormOptions>({
        criteriaMode: "all",
    });
    const submitHandler = React.useCallback(
        (data: FormOptions) => {
            onSubmit(data);
        },
        [onSubmit]
    );
    return (
        <>
            <form onSubmit={handleSubmit(submitHandler)} className="form">
                <h2>{title}</h2>
                {name && (
                    <FormField
                        inputType="text"
                        inputProps={register("name", nameValidations)}
                        label="שם"
                        inputClass={errors.email && "input-error"}
                    />
                )}
                {email && (
                    <FormField
                        inputType="text"
                        inputProps={register("email", emailValidations)}
                        label="אימייל"
                        inputClass={errors.email && "input-error"}
                    />
                )}
                {password && (
                    <FormField
                        inputType="password"
                        inputProps={register("password", passwordValidations)}
                        label="סיסמא"
                        inputClass={errors.password && "input-error"}
                    />
                )}

                <div className="form-helper">
                    <ErrorMessage
                        errors={errors}
                        name="name"
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <p key={type}>{message}</p>
                            ))
                        }
                    />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <p key={type}>{message}</p>
                            ))
                        }
                    />
                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({ messages }) =>
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <p key={type}>{message}</p>
                            ))
                        }
                    />
                </div>
                <button type="submit" className="form-submit-btn">
                    {submitLabel}
                </button>
            </form>
        </>
    );
};

export default Form;
