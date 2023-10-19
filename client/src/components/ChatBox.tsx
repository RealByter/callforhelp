import React, { useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import BlockIcon from '@mui/icons-material/Block';

export interface IChatBoxProps {
  sendChatMsg: (text: string) => void;
  blockSupporter: () => void
}

export const ChatBox: FC<IChatBoxProps> = ({ sendChatMsg, blockSupporter }: IChatBoxProps) => {
  const [currentMsg, setCurrentMsg] = useState<string>('');

  const sendMsg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //add validation of input
    if (currentMsg !== '') {
      sendChatMsg(currentMsg);
      setCurrentMsg("");
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCurrentMsg(e.target.value);
  };

  return (
    <div className="chat-input">
      <button className="chat-input-block" onClick={blockSupporter}>
        <BlockIcon />
      </button>
      <form className="chat-input-parts"  onSubmit={(e) => sendMsg(e)}>
        <input
          className="chat-input-parts-box"
          value={currentMsg}
          onChange={handleChange}
          placeholder="הודעה"
        />
        <button className="chat-input-parts-send" type="submit">
          <SendRoundedIcon />
        </button>
      </form>
    </div>
  );
};
