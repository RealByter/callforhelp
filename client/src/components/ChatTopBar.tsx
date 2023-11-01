import React from 'react';

interface IChatTopBarProps {
  isChatEnded: boolean;
  isSupporter: boolean;
  companionName: string;
  endChat: () => void;
  changeSupporter: () => void;
  findAdditionalSupportee: () => void;
  goBackToChatsPage: () => void;
}

export const ChatTopBar: React.FC<IChatTopBarProps> = ({
  isChatEnded,
  isSupporter,
  companionName,
  endChat,
  changeSupporter,
  findAdditionalSupportee,
  goBackToChatsPage
}: IChatTopBarProps) => {
  return (
    <div className={`chat-top-bar ${isChatEnded ? 'ended' : ''}`}>
      <div className="chat-top-bar-upper">
        <button className="top-bar-close" onClick={goBackToChatsPage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M18 6L6 18"
              stroke="#0E1C74"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#0E1C74"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="top-bar-text">
          <span className="title">{companionName || 'התומך המאושר'}</span>
          <span className="sub-title">אני פה בשבילך</span>
        </div>
      </div>
      <div className="chat-top-bar-lower">
        {isChatEnded ? (
          <p>השיחה הסתיימה</p>
        ) : (
          <div className="chat-top-bar-lower-buttons">
            {isSupporter ? (
              <button onClick={findAdditionalSupportee} disabled={!companionName}>
                מצא נתמך נוסף
              </button>
            ) : (
              <button onClick={changeSupporter} disabled={!companionName}>
                החלף תומך
              </button>
            )}
            <button onClick={endChat} disabled={!companionName}>
              סיום שיחה
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
