import React from 'react';
import "../styles/paragraph.scss";

export interface ParagraphProps {
    children: React.ReactNode;
}

const Paragraph: FC<ParagraphProps> = ({ children }: ParagraphProps) => {
    return (
        <p className="generic-paragraph">
            {children}
        </p>
    )
}

export default Paragraph;