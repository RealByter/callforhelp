import React from 'react';
import "../styles/paragraph.scss";

export interface ParagraphProps {
    children: React.ReactNode;
    isBold: boolean
}

const Paragraph: FC<ParagraphProps> = ({ children, isBold }: ParagraphProps) => {
    return (
        <p className="generic-paragraph" style={{ fontSize: isBold ? "bold" : "initial" }}>
            {children}
        </p>
    )
}

export default Paragraph;