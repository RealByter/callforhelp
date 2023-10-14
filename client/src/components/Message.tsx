import React from 'react';

export interface MessageProps {
  id: number;
  isSender: boolean;
  content: string;
}

export const Message: FC<MessageProps> = ({ id, isSender, content }: MessageProps) => {
  return (
    <div key={id} className={`massage-body ${isSender ? 'sender' : ''}`}>
      {content || ''}
    </div>
  );
};
