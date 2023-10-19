import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";

// get unique id of given length
// TODO- the chat id will be from the client (fireStore)
function getUniqueId(length: number) {
    const id = uuid();
    return id.substring(0, Math.min(length, id.length));
}

//get the current date in israel (you can't use just new Date()
//because it will get the date of the location where the server is located) 
function getCurrDateIsrael() {

    const here = new Date();

    // suppose the date is 12:00 UTC
    const invDate = new Date(here.toLocaleString('en-US', { timeZone: "Israel" }));

    // then invDate will be 07:00 in Toronto
    // and the diff is 5 hours
    const diff = here.getTime() - invDate.getTime();

    return new Date(here.getTime() - diff);
}


export default (io: Server, socket: Socket) => {

    const sendMessage = (data: any, extra: undefined, callback: Function) => {
        const { chatID, msg: message } = data
        const messageID = getUniqueId(6);

        const currentDateInIsrael = getCurrDateIsrael();
        const messageDate = currentDateInIsrael.toISOString();

        socket.broadcast.to(chatID).emit("get message", { chatID, messageID, message, messageDate })
        callback(messageID, messageDate);
    }

    const stopChat = (data: any) => {
        const { chatID } = data;
        socket.broadcast.to(chatID).emit("close chat", chatID);
    }

    const blockChat = (data: any) => {
        const { chatID } = data;
        socket.broadcast.to(chatID).emit("chat blocked", chatID);
    }

    const joinRoom = (data: any) => {
        const { chatID } = data;
        socket.join(chatID);
    }

    socket.on("send message", sendMessage);
    socket.on("stop chat", stopChat);
    socket.on("block chat", blockChat);
    socket.on("join-chat", joinRoom);
}