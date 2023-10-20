import { Server, Socket } from "socket.io";

export default (io: Server, socket: Socket) => {

    const sendMessage = (data: any, extra: undefined, callback: Function) => {
        const { chatID, msg: message, messageDate } = data;
        socket.broadcast.to(chatID).emit("get message", { chatID, message, messageDate })
        callback(messageDate);
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
        socket.broadcast.to(chatID).emit('user-joined');
    }

    socket.on("send message", sendMessage);
    socket.on("stop chat", stopChat);
    socket.on("block chat", blockChat);
    socket.on("join-chat", joinRoom);
}