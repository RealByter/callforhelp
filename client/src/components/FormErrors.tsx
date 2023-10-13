import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors } from "react-hook-form";

const Errors = (name: string, errors: FieldErrors) => {
    return (
        errors[name] && (
            <ErrorMessage
                errors={errors}
                name={name}
                render={({ messages }) => {
                    return messages
                        ? Object.entries(messages).map(([type, message]) => (
                              <p key={type}>{message}</p>
                          ))
                        : null;
                }}
            />
        )
    );
};
export default Errors;
