import React, { useState, useRef } from 'react';

export interface IChatBoxProps {
  sendChatMsg: (text: string) => void;
  disabled: boolean;
}

export const ChatBox: React.FC<IChatBoxProps> = ({ sendChatMsg, disabled }: IChatBoxProps) => {
  const [currentMsg, setCurrentMsg] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //add validation of input
    if (currentMsg !== '') {
      sendChatMsg(currentMsg);
      setCurrentMsg('');
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentMsg(e.currentTarget.value);
  };

  return (
    <div className="chat-input">
      <form className="chat-input-parts" onSubmit={(e) => sendMsg(e)}>
        <input
          ref={inputRef}
          className={`chat-input-parts-box `}
          disabled={disabled}
          value={currentMsg}
          onChange={handleChange}
          placeholder={disabled ? '' : 'הודעה'}
        />
        <button
          className={`chat-input-parts-send`}
          disabled={disabled}
          type="submit"
          onClick={() => inputRef.current?.focus()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M2.84874 9.4547L16.0452 2.06467C16.1562 2.0025 16.2836 1.97569 16.4102 1.98784C16.5369 1.99998 16.6568 2.0505 16.754 2.13263C16.8512 2.21476 16.921 2.3246 16.9541 2.44747C16.9872 2.57033 16.982 2.70037 16.9392 2.8202L14.45 9.7898C14.4015 9.92574 14.4015 10.0743 14.45 10.2102L16.9392 17.1798C16.982 17.2997 16.9872 17.4297 16.9541 17.5526C16.921 17.6754 16.8512 17.7853 16.754 17.8674C16.6568 17.9495 16.5369 18 16.4102 18.0122C16.2836 18.0243 16.1562 17.9975 16.0452 17.9354L2.84873 10.5453C2.7518 10.491 2.67109 10.4119 2.61491 10.3161C2.55873 10.2202 2.52912 10.1111 2.52912 10C2.52912 9.88891 2.55873 9.77982 2.61491 9.68397C2.67109 9.58812 2.7518 9.50898 2.84874 9.4547V9.4547Z"
              stroke="#ACB3DE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.375 10H9.375"
              stroke="#ACB3DE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
