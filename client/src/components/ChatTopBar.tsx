import React from 'react';
import FindAdditionalSupportee from './FindAdditionalSupportee';

interface IChatTopBarProps {
  isMinimized: boolean;
  isChatEnded: boolean;
  isSupporter: boolean;
  companionName: string;
  userId?: string;
  endChat: () => void;
  changeSupporter: () => void;
  findAdditionalSupportee: () => void;
  goBackToChatsPage: () => void;
}

export const ChatTopBar: React.FC<IChatTopBarProps> = ({
  isMinimized,
  isChatEnded,
  isSupporter,
  companionName,
  userId,
  endChat,
  changeSupporter,
  findAdditionalSupportee,
  goBackToChatsPage
}: IChatTopBarProps) => {
  let subTitle = '';
  if (companionName) {
    if (isSupporter) subTitle = 'אני צריך תמיכה';
    else subTitle = 'אני פה בשבילך';
  } else {
    if (isSupporter) subTitle = 'אצטרך תמיכה';
    else subTitle = 'אהיה פה בשבילך';
  }

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
          <span className="title">{companionName || 'מחפשים...'}</span>
          <span className="sub-title">{subTitle}</span>
        </div>
      </div>
      <div className={`chat-top-bar-lower ${isMinimized ? "slide-out-top" : "slide-in-top"}`}>
        {isChatEnded ? (
          <p>השיחה הסתיימה</p>
        ) : (
          <div className="chat-top-bar-lower-buttons">
            {isSupporter ? (
              <FindAdditionalSupportee
                findAdditionalSupportee={findAdditionalSupportee}
                disabled={!companionName}
                userId={userId}
              />
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
