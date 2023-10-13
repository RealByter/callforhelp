import React, { useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

export interface ChatInputProps {
    sendMsgFunc: (text: string) => void
}

export const ChatInput: FC<ChatInputProps> = ({ sendMsgFunc }: ChatInputProps) => {
    const [input, setInput] = useState<string>("");

    const sendMsg = () => {
        //add validation of input
        sendMsgFunc?.(input);
    }

    const checkEnterPress = (e: KeyboardEvent) => {
        if (e.key === 13) {
            sendMsg();
        }
        return;
    }

    const setInputOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        return;
    }

    return (
        <div className="chat-input">
            <div className="chat-input-parts">
                <input className="chat-input-box" 
                        value={input} 
                        onChange={setInputOnChange}
                        onKeyDown={checkEnterPress}
                        placeholder="הודעה" />
                <button className="chat-input-send" onClick={() => sendMsg()}>
                    <SendRoundedIcon />
                </button>
            </div>
        </div>
    )
}
