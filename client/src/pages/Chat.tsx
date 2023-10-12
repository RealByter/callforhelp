import React, { useMemo, useState } from 'react';
import { Message, MessageProps } from '../components/Message';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatInput } from "../components/ChatInput";
import '../styles/Chat.css';


export const Chat = () => {
    const [msg, setMsg] = useState<MessageProps[]>([
        {isSender: false, content: "dfsdf"},
        {isSender: false, content: "dfsdf"},
        {isSender: true, content: "lkjdflkjsdj "}
    ]);

    const msgIsEmpty = useMemo(() => msg.length == 0, msg)




    return (
        <div className="chat-page" >
            <ChatTopBar />


            <div className="messages">
                {msgIsEmpty ? 
                    <span>No Msgs Available</span> 
                    : msg.map((m) => <Message isSender={m.isSender} content={m.content} />)}
            </div>
            
            <ChatInput />
        </div>
    )
}
