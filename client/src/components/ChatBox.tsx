import React, { useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import BlockIcon from '@mui/icons-material/Block';

export interface IChatBoxProps {
  sendChatMsg: (text: string) => void;
}

export const ChatBox: FC<IChatBoxProps> = ({ sendChatMsg }: IChatBoxProps) => {
  const [currentMsg, setCurrentMsg] = useState<string>('');

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //add validation of input
    sendChatMsg?.(currentMsg);
  };

  const setInputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentMsg(e.target.value);
    return;
  };

  return (
    <div className="chat-input">
      <button className="chat-input-block">
        <BlockIcon />
      </button>
      <form className="chat-input-parts"  onSubmit={(e) => sendMsg(e)}>
        <input
          className="chat-input-parts-box"
          value={currentMsg}
          onChange={setInputOnChange}
          placeholder="הודעה"
        />
        <button className="chat-input-parts-send" type="submit">
          <SendRoundedIcon />
        </button>
      </form>
    </div>
  );
};
