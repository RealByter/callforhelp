import React, { LegacyRef, forwardRef, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { collections } from '../firebase/connection';

export interface IMessageProps {
  messageId: string | undefined,
  isSender: boolean;
  content: string;
  messageDate: string;
  messageState: 'sent' | 'received' | 'read';
  ref: any;
}

export const Message: React.FC<IMessageProps> = forwardRef(({ messageId, isSender, content, messageDate, messageState }, ref: LegacyRef<HTMLDivElement>) => {

  useEffect(() => {
    if (isSender) return;
    if (messageState == "read") return;


    (async () => {
      await updateDoc(doc(collections.messages, messageId), { status: "read" });
    })();
  }, [isSender, messageId, messageState])

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    return `${hour}:${minute >= 10 ? minute : '0' + minute}`;
  };
  
  return (
    <div className={`message-body ${isSender ? 'sender' : ''} ${messageState}`} ref={ref}>
      <div className="content">{content || ''}</div>
      <div className="date">{formatDate(messageDate)}</div>
    </div>
  );
});
