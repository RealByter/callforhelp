import React, { useEffect, useRef, useState } from 'react';
import { Message, IMessageProps } from '../components/Message';
import { MOCK_MESSAGES } from '../mock-data/chat-mock-data';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { useNavigate, useParams } from "react-router-dom";
import { ChatTopBar } from '../components/ChatTopBar';
import { ChatBox } from '../components/ChatBox';

/*
  question - if we are in the application, and we get a message "start chat",
  do we want to prompt a message? or do we want to do things only when we are
  in the page of all chats?
  in addition, is there a listener that's need to be held in the page of the 
  supporter search page?

  TODO - also - take care of the disconnect events
  TODO - also - take care of cases in which the chat id doesnt exist
*/

interface IGetMsgData {
  chatID: string,
  message: string,
  messageID: string,
  messageDate: Date
}

interface IMsg extends IMessageProps {
  id: number | string
}

export const Chat = () => {
  const [msg, setMsg] = useState<IMsg[]>(MOCK_MESSAGES);
  const [didChatEnded, setDidChatEnded] = useState(false);
  const [isSupporter, setIsSupporter] = useState(true);
  const scrollingRef = useRef(null);
  const { socket } = useSocketCtx();
  const navigate = useNavigate();
  const { chatId: thisChatId } = useParams();
  const msgIsEmpty = (msg.length === 0);

  useEffect(() => {
    // take care of all the socket events
    socket.on("get message", receiveMsg);
    socket.on("close chat", closeChat);
    socket.on("chat blocked", closeChat);
    return () => {
      socket.off("get message");
      socket.off("close chat");
      socket.off("chat blocked");
    };
  }, [socket]);

  useEffect(() => {
    // scroll to bottom of the chat from whhen getting a new msg
    scrollingRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg]);

  // send msg using socket
  const sendMsg = (message: string) => {
    socket.emit("send message", { msg: message, chatId: thisChatId }, (res: any) => {
      addToMsgList(message, true, res.messageId);
      return;
    });
  };

  // receive msg using socket
  const receiveMsg = (data: IGetMsgData) => {
    const { chatID, message, messageID } = data;
    if (chatID == thisChatId) {
      addToMsgList(message, false, messageID);
    }
  }

  // add new msg to msg list
  const addToMsgList = (message: string, isSender: boolean, messageID: string) => {
    //see if maybe it is possible to get the msg id from the server
    setMsg((prev) => ([...prev, {
      id: messageID || (prev.length + 1),
      content: message,
      isSender
    }]));
  }

  // finish the chat (permanently) using socket
  const closeChat = () => {
    setDidChatEnded(true);
    //some ending chat architecture
  }

  // block the chat
  const blockSupporter = () => {
    socket.emit("block chat", {});
  }

  // go back to the page of all chats
  const goBackToChatsPage = () => {
    navigate("/");
  }

  // request to change partner
  const changeChatRoom = () => {
    // maybe create another event for re-searching?
    socket.emit("search partner");
  }

  // finish current chat
  const endChat = () => {
    socket.emit("close chat", { chatID: thisChatId });
    //alert?
    goBackToChatsPage();
  }

  return (
    <div className="chat-page">
      <ChatTopBar
        chatEnded={didChatEnded}
        isSupporter={isSupporter}
        endChat={endChat}
        changeChatRoom={changeChatRoom}
        goBackToChatsPage={goBackToChatsPage} />

      <div className="messages">
        {msgIsEmpty ? (
          <span className="no-msg">עוד אין הודעות</span>
        ) : (
            msg.map((m) => (
              <React.Fragment key={m.id}>
                <Message
                  isSender={m.isSender}
                  content={m.content}
                  messageDate={m.messageDate} />
              </React.Fragment>
            ))
          )}
        <span ref={scrollingRef}></span>
      </div>

      <ChatBox sendChatMsg={sendMsg} blockSupporter={blockSupporter} />
    </div>
  );
};
