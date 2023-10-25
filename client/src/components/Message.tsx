import React from 'react';

export interface IMessageProps {
  isSender: boolean;
  content: string;
  messageDate: string;
  messageState: 'sent' | 'received' | 'loading' | 'read';
}

export const Message: React.FC<IMessageProps> = ({
  isSender,
  content,
  messageDate,
  messageState
}: IMessageProps) => {
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
