import React, { useMemo, useState } from 'react';
import { Message, MessageProps } from '../components/Message';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatInput } from '../components/ChatInput';
import '../styles/Chat.scss';

export const Chat = () => {
  const [msg, setMsg] = useState<MessageProps[]>([
    { isSender: false, content: 'הודעה ראשונה', id: 1 },
    { isSender: false, content: 'הודעה שנייה', id: 2 },
    { isSender: true, content: 'תגובה ראשונה אמור להיות בסדר ', id: 3 },
    { isSender: false, content: 'הודעה שנייה', id: 4 },
    { isSender: false, content: 'הודעה שנייה', id: 5 },
    { isSender: false, content: 'הודעה שנייה', id: 6 },
    { isSender: false, content: 'הודעה שנייה', id: 7 },
    { isSender: false, content: 'הודעה שנייה', id: 8 },
  ]);

  const msgIsEmpty = useMemo(() => msg.length == 0, msg);

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
              <Message id={m.id} isSender={m.isSender} content={m.content} />
            </React.Fragment>
          ))
        )}
      </div>

      <ChatInput sendMsgFunc={sendMsg} />
    </div>
  );
};
