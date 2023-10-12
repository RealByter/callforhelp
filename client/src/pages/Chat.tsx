import React, { useMemo, useState } from 'react';
import { Message, MessageProps } from '../components/Message';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatInput } from "../components/ChatInput";
import '../styles/Chat.scss';


export const Chat = () => {
    const [msg, setMsg] = useState<MessageProps[]>([
        {isSender: false, content: "הודגעה ראשונה"},
        {isSender: false, content: "הודעה שנייה"},
        {isSender: true, content: "תגובה ראשונה אמור להיות בסדר "}
    ]);

    const msgIsEmpty = useMemo(() => msg.length == 0, msg)


    return (
        <div className="chat-page" >
            <ChatTopBar chatEnded={false} isSupporter={true} />


            <div className="messages">
                {msgIsEmpty ? 
                    <span className="no-msg">עוד אין הודעות</span> 
                    : msg.map((m) => <Message isSender={m.isSender} content={m.content} />)}
            </div>
            
            <ChatInput />
        </div>
    )
}
