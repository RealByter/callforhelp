import React from 'react';

export interface ParagraphProps {
    children: React.ReactNode;
    isBold: boolean
}

const Paragraph: FC<ParagraphProps> = ({ children, isBold }: ParagraphProps) => {
    return (
        <p className="generic-paragraph" style={{ fontWeight: isBold ? "bold" : "initial" }}>
            {children}
        </p>
    )
}

export default Paragraph;