import React from "react";
import "../styles/forms.scss";

type HintProps = {
    text: string;
};

const Hint = (props: Props) => {
    const { text } = props;
    return (
        <div className="form-field-hint">
            {text}
            <div className="form-field-hint-triangle"></div>
        </div>
    );
};
export default Hint;
