import React from 'react';
import '../styles/forms.scss';

export type HintProps = {
  messages?: string | string[];
  component?: React.JSX.Element;
};

const Hint = (props: HintProps) => {
  const { messages, component } = props;
  const content = Array.isArray(messages) ? (
    messages.map((item) => <p key={`hint-${item}${Math.random().toString()}`}>{item}</p>)
  ) : (
    <p>{messages}</p>
  );
  return (
    <div className="form-field-hint">
      {messages && content}
      {component && component}
      <div className="form-field-hint-triangle"></div>
    </div>
  );
};
export default Hint;
