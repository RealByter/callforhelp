import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

interface ChatTopBarProps {
    chatEnded: boolean,
    isSupporter: boolean,
    endChat?: () => void,
    replace?: () => void
}

export const ChatTopBar: FC<ChatTopBarProps> = ({ chatEnded, isSupporter, endChat, replace }: ChatTopBarProps) => {
    return (
        <div className={`chat-top-bar ${chatEnded ? "ended" : ""}`}>
            <div className="chat-top-bar-upper">
                <div className="top-bar-text">
                    <span className="title">התומך המאושר</span>
                    <span className="sub-title">אני פה בשבילך</span>
                </div>
                <button className="top-bar-close">
                    <CloseIcon />
                </button>
            </div>
            <div className="chat-top-bar-lower">
                {chatEnded ? <p>השיחה הסתיימה</p> : 
                    <div className="chat-top-bar-lower-buttons">
                        <button onClick={() => { replace?.() }}>{isSupporter ? "איתור נתמך נוסף" : "החלף תומך"}</button>
                        <button onClick={() => { endChat?.() }}>סיום שיחה</button>
                    </div>}
            </div>
        </div>
    )
}
