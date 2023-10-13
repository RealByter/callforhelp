export const nameValidations = {
    required: "נדרש להכניס שם",
    minLength: {
        value: 2,
        message: "צריך להיות לפחות 2 תווים",
    },
};
export const emailValidations = {
    required: "צריך להכניס מייל",
    // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
    pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "אימייל לא בתבנית נכונה",
    },
};

export const passwordValidations = {
    required: "צריך להכניס סיסמא",
    minLength: {
        value: 8,
        message: "צריך להיות לפחות 8 תווים",
    },
    pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "סיסמא לא תקינה",
    },
};
