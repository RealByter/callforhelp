import React from "react";
import classes from "./FormField.module.css";
import Eye from "../assets/eye.svg";
import NoShowEye from "../assets/eye-slash.svg";
import { useForm } from "react-hook-form";
type TextInputProps = {
    label: string;
    inputType?: string;
    rtl?: boolean;
    placeHolder?: string;
    // required?: boolean;
    inputProps: any;
};

export default function FormField(props: TextInputProps) {
    const {
        label,
        inputType = "text",
        rtl = true,
        inputProps,
        placeHolder = label,
    } = props;
    // const [show, setShown] = React.useState(false);
    // const isShown = () => {
    //     if (inputType !== "password") {
    //         return inputType;
    //     }
    //     return show ? "text" : "password";
    // };
    // const toggleShown = () => {
    //     setShown((prev) => !prev);
    // };
    // const eyeContent = () => {
    //     if (inputType !== "password") {
    //         return null;
    //     }
    //     if (show) {
    //         return (
    //             <img
    //                 className={classes.eye}
    //                 src={NoShowEye}
    //                 width={24}
    //                 height={24}
    //                 onClick={toggleShown}
    //             />
    //         );
    //     }
    //     return (
    //         <img
    //             className={classes.eye}
    //             src={Eye}
    //             width={24}
    //             height={24}
    //             onClick={toggleShown}
    //         />
    //     );
    // };

    return (
        <div className={`${classes["form-field"]} ${rtl ? classes.rtl : ""} `}>
            <label htmlFor={`input-${label}`}>{label}</label>
            <input
                {...inputProps!}
                type={inputType}
                className={classes.input}
                placeholder={placeHolder}
            />
        </div>
    );
}
