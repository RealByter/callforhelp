import React from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

export interface ChatItemProps {
  name: string;
  isEnded: boolean;
  chatId: string;
}

export const ChatItem: React.FC<ChatItemProps> = ({ name, isEnded, chatId }: ChatItemProps) => {
  const navigate = useNavigate();

  return (
    <li
      className={`chat-item ${isEnded && 'chat-item-ended'}`}
      onClick={() =>
        navigate({
          pathname: '/chat',
          search: createSearchParams({ chatId: chatId }).toString()
        })
      }
      tabIndex={0}>
      <p className="name">{name}</p>
      <svg
        className="arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none">
        <path d="M10 12L6 8L10 4" stroke="#0E1C74" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </li>
  );
};
