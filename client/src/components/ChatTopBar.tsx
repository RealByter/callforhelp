import React from 'react';

interface ChatTopBarProps {
    chatEnded: boolean
}

export const ChatTopBar: FC<ChatTopBarProps> = ({ chatEnded }: ChatTopBarProps) => {
    return (
        <div className={`chat-top-bar ${chatEnded ? "ended" : ""}`}>
            <div className="chat-top-bar-upper">
                <div className="top-bar-text">
                    <span className="title">יעל יעלי</span>
                    <span className="sub-title">אני פה בשבילך</span>
                </div>
                <div className="top-bar-close">
                    x
                </div>
            </div>
            <div className="chat-top-bar-lower">
                {chatEnded ? <p>השיחה הסתיימה</p> : <div className="chat-top-bar-lower-buttons">
                        <button>איתור נתמך נוסף</button>
                        <button>סיום שיחה</button>
                    </div>}
            </div>
        </div>
    )
}
