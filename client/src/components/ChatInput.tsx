import React from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

export const ChatInput = () => {
    return (
        <div className="chat-input">
            <div className="chat-input-parts">
                <input className="chat-input-box" placeholder="הודעה" />
                <button className="chat-input-send">
                    <SendRoundedIcon />
                </button>
            </div>
        </div>
    )
}
