import React, { useEffect, useRef, useState } from 'react';
import { Message, IMessageProps } from '../components/Message';
import { MOCK_MESSAGES } from '../mock-data/chat-mock-data';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';

/*
  question - if we are in the application, and we get a message "start chat",
  do we want to prompt a message? or do we want to do things only when we are
  in the page of all chats?
  in addition, is there a listener that's need to be held in the page of the 
  supporter search page?
*/

interface IGetMsgData {
  chatID: string,
  message: string,
  messageID: string
}

interface IMsg extends IMessageProps {
  id: number | string
}

export const Chat = () => {
  const [thisChatId, setThisChatId] = useState("");
  const [msg, setMsg] = useState<IMsg[]>(MOCK_MESSAGES);
  const [didChatEnded, setDidChatEnded] = useState(false);
  const scrollingRef = useRef(null);
  const { socket } = useSocketCtx();

  useEffect(() => {
    //TODO - listen to events
    socket.on("get message", receiveMsg);
    socket.on("close chat", closeChat);
    socket.on("chat blocked", closeChat);
    return () => {
      //TODO - off the listener on the events
      socket.off("get message");
      socket.off("close chat");
      socket.off("chat blocked");
    };
  }, [socket]);

  useEffect(() => {
    scrollingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg]);

  const msgIsEmpty = msg.length === 0;

  const sendMsg = (message: string) => {
    socket.emit("send message", { msg: message, chatId: thisChatId }, (res: any) => {
      addToMsgList(message, true, res.messageId);
      return;
    });
    // addToMsgList(message, true);
  };

  const receiveMsg = (data: IGetMsgData) => {
    const { chatID, message, messageID } = data;
    if (chatID == thisChatId) {
      addToMsgList(message, false, messageID);
    }

  }

  const addToMsgList = (message: string, isSender: boolean, messageID: string) => {
    //see if maybe it is possible to get the msg id from the server
    setMsg((prev) => ([...prev, {
      id: messageID || (prev.length + 1),
      content: message,
      isSender
    }]));
  }

  const closeChat = () => {
    setDidChatEnded(true);
    //some ending chat architecture
  }

  const blockSupporter = () => {
    //send event of chat blocking
    // socket.send("block chat", {});
  }

  return (
    <div className="chat-page">
      <ChatTopBar chatEnded={didChatEnded} isSupporter={true} />

      <div className="messages">
        {msgIsEmpty ? (
          <span className="no-msg">עוד אין הודעות</span>
        ) : (
            msg.map((m) => (
              <React.Fragment key={m.id}>
                <Message isSender={m.isSender} content={m.content} />
              </React.Fragment>
            ))
          )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} blockSupporter={blockSupporter} />
    </div>
  );
};
