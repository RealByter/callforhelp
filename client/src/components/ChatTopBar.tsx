import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface IChatTopBarProps {
  isChatEnded: boolean;
  isSupporter: boolean;
  endChat: () => void;
  changeChatRoom: () => void;
  goBackToChatsPage: () => void;
}

export const ChatTopBar: FC<IChatTopBarProps> = ({
  isChatEnded,
  isSupporter,
  endChat,
  changeChatRoom,
  goBackToChatsPage
}: IChatTopBarProps) => {
  return (
    <div className={`chat-top-bar ${isChatEnded ? 'ended' : ''}`}>
      <div className="chat-top-bar-upper">
        <div className="top-bar-text">
          <span className="title">התומך המאושר</span>
          <span className="sub-title">אני פה בשבילך</span>
        </div>
        <button className="top-bar-close" onClick={() => goBackToChatsPage()}>
          <CloseIcon />
        </button>
      </div>
      <div className="chat-top-bar-lower">
        {isChatEnded ? (
          <p>השיחה הסתיימה</p>
        ) : (
            <div className="chat-top-bar-lower-buttons">
              <button onClick={() => changeChatRoom}>
                {isSupporter ? 'איתור נתמך נוסף' : 'החלף תומך'}
              </button>
              <button onClick={() => endChat()}>
                סיום שיחה
              </button>
            </div>
          )}
      </div>
    </div>
  );
};
