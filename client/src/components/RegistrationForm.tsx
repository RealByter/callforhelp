import React from "react";
import FormField from "./FormField";
import { useForm } from "react-hook-form";
import Errors from "./FormErrors";
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
    } = useForm<RegistrationFormI>({
        criteriaMode: "all",
    });
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
                hint={{
                    component: Errors("name", errors),
                }}
            />
            <FormField
                inputType="text"
                inputProps={register("email", emailValidations)}
                label="אימייל"
                inputClass={errors.email && "input-error"}
                hint={{ component: Errors("email", errors) }}
            />
            <FormField
                inputType="password"
                inputProps={register("password", passwordValidations)}
                label="סיסמא"
                inputClass={errors.password && "input-error"}
                hint={{ component: Errors("password", errors) }}
            />

            <div className="form-helper">
                <p>הסיסמא צריכה לעמוד בתנאים הבאים</p>
                <ul>
                    <li>להכיל לפחות 8 תווים</li>
                    <li>להכיל אות קטנה אחת לפחות</li>
                    <li>להכיל אות גדולה אחת לפחות</li>
                    <li>להכיל סימן</li>
                    <li>להכיל מספר</li>
                </ul>
            </div>
            <button type="submit" className="form-submit-btn">
                הרשם
            </button>
        </form>
    );
};

export default RegistrationForm;
