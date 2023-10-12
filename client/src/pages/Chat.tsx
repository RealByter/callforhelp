import React, { useMemo, useState } from 'react';
import { Message, MessageProps } from '../components/Message';
import '../styles/Chat.css';


export const Chat = () => {
    const [msg, setMsg] = useState<MessageProps[]>([
        {isSender: false, content: "dfsdf"},
        {isSender: false, content: "dfsdf"}]
        )

    const msgIsEmpty = useMemo(() => msg.length == 0, msg)




    return (
        <div className="chat-page" >


            <div className="messages">
                {msgIsEmpty ? 
                    <span>No Msgs Available</span> 
                    : msg.map((m) => <Message isSender={m.isSender} content={m.content} />)}
            </div>
            
        </div>
    )
}
