import React from 'react';

export interface IMessageProps {
  isSender: boolean;
  content: string;
}

export const Message: FC<IMessageProps> = ({ isSender, content }: IMessageProps) => {
  return (
    <div className={`massage-body ${isSender ? 'sender' : ''}`}>
      {content || ''}
    </div>
  );
};
