import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface ChatTopBarProps {
    chatEnded: boolean,
    isSupporter: boolean
}

export const ChatTopBar: FC<ChatTopBarProps> = ({ chatEnded, isSupporter }: ChatTopBarProps) => {
    return (
        <div className={`chat-top-bar ${chatEnded ? "ended" : ""}`}>
            <div className="chat-top-bar-upper">
                <div className="top-bar-text">
                    <span className="title">יעל יעלי</span>
                    <span className="sub-title">אני פה בשבילך</span>
                </div>
                <div className="top-bar-close">
                    <CloseIcon />
                </div>
            </div>
            <div className="chat-top-bar-lower">
                {chatEnded ? <p>השיחה הסתיימה</p> : <div className="chat-top-bar-lower-buttons">
                        <button>{isSupporter ? "איתור נתמך נוסף" : "החלף תומך"}</button>
                        <button>סיום שיחה</button>
                    </div>}
            </div>
        </div>
    )
}
