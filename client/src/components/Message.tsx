import React from 'react';

export interface MessageProps {
  isSender: boolean;
  content: string;
}

export const Message: FC<MessageProps> = ({ isSender, content }: MessageProps) => {
  return (
    <div className={`massage-body ${isSender ? 'sender' : ''}`}>
      {content || ''}
    </div>
  );
};
