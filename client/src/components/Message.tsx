import React, { useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { collections } from '../firebase/connection';

export interface IMessageProps {
  messageId: string,
  isSender: boolean;
  content: string;
  messageDate: string;
  messageState: 'sent' | 'received' | 'read';
}

export const Message: React.FC<IMessageProps> = ({ messageId, isSender, content, messageDate, messageState }: IMessageProps) => {

  useEffect(() => {
    if (isSender) return;
    if (!messageId) return;

    (async () => {
      await updateDoc(doc(collections.messages, messageId), { status: "read" });
    })();
  }, [messageId])

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    return `${hour}:${minute >= 10 ? minute : '0' + minute}`;
  };

  return (
    <div className={`message-body ${isSender ? 'sender' : ''} ${messageState}`}>
      <div className="content">{content || ''}</div>
      <div className="date">{formatDate(messageDate)}</div>
    </div>
  );
};
