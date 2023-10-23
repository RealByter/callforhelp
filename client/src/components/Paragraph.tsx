import React from 'react';

export interface ParagraphProps {
    children: React.ReactNode;
    isBold: boolean;
    dir: 'ltr' | 'rtl' | 'auto'
}

const Paragraph: React.FC<ParagraphProps> = ({ children, isBold, dir='ltr' }: ParagraphProps) => {
    return (
        <p className="generic-paragraph" dir={dir} style={{ fontWeight: isBold ? "bold" : "initial" }}>
            {children}
        </p>
    )
}

export default Paragraph;