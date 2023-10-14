import React, { useMemo, useState } from 'react';
import { Message, MessageProps } from '../components/Message';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';
import '../styles/Chat.scss';
import { MOCK_MESSAGES } from '../mock-data/chat-mock-data';

export const Chat = () => {
  const [msg, setMsg] = useState<MessageProps[]>(MOCK_MESSAGES);

  const msgIsEmpty = msg.length;

  const sendMsg = (text: string) => {
    //some sending logic with socket
  };

  return (
    <div className="chat-page">
      <ChatTopBar chatEnded={false} isSupporter={true} />

      <div className="messages">
        {msgIsEmpty ? (
          <span className="no-msg">עוד אין הודעות</span>
        ) : (
          msg.map((m) => (
            <React.Fragment key={m.id}>
              <Message isSender={m.isSender} content={m.content} />
            </React.Fragment>
          ))
        )}
      </div>

      <ChatBox sendMsgFunc={sendMsg} />
    </div>
  );
};
