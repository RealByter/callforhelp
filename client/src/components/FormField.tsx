import React from "react";
import Eye from "../assets/eye.svg";
import NoShowEye from "../assets/eye-slash.svg";
import "../styles/forms.scss";
import Hint, { HintProps } from "./Hint";
type TextInputProps = {
    label: string;
    inputType?: string;
    placeHolder?: string;
    inputProps: any; // Should have the useForm register props
    inputClass?: string;
    hint?: HintProps;
};

export default function FormField(props: TextInputProps) {
    const {
        label,
        inputType = "text",
        inputProps,
        inputClass = "",
        placeHolder = label,
        hint,
    } = props;
    const [shown, setShown] = React.useState(inputType !== "password");
    const toggleShown = () => {
        setShown((prev) => !prev);
    };
    const eye = shown ? NoShowEye : Eye;
    const effectiveInputType =
        inputType !== "password" ? inputType : shown ? "text" : "password";
    return (
        <div className="form-field">
            <label htmlFor={`input-${inputProps.name}`}>{label}</label>
            <div className="form-field-input-container">
                {hint && (hint.messages || hint.component) && (
                    <Hint {...hint} />
                )}
                <input
                    {...inputProps!}
                    type={effectiveInputType}
                    className={`form-field-input ${inputClass}`}
                    placeholder={placeHolder}
                />
                {inputType === "password" && (
                    <img
                        className="form-field-eye"
                        width={24}
                        height={24}
                        src={eye}
                        onClick={toggleShown}
                    />
                )}
            </div>
        </div>
    );
}
