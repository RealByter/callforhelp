import React from 'react';

export interface IMessageProps {
  isSender: boolean,
  content: string,
  messageDate: string
}

export const Message: React.FC<IMessageProps> = ({ isSender, content, messageDate }: IMessageProps) => {

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    return (`${hour}:${minute}`);
  }

  return (
    <div className={`massage-body ${isSender ? 'sender' : ''}`}>
      <div className="content">
        {content || ''}
      </div>
      <div className="date">
        {formatDate(messageDate)}
      </div>
    </div>
  );
};
