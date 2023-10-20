import { Server, Socket } from 'socket.io';

export default (io: Server, socket: Socket) => {
  const sendMessage = (data: any, extra: undefined, callback: Function) => {
    const { chatID, msg: message, messageDate } = data;
    socket.broadcast.to(chatID).emit('get message', { chatID, message, messageDate });
    callback(messageDate);
  };

  const stopChat = (data: any) => {
    const { chatID } = data;
    socket.broadcast.to(chatID).emit('close chat', chatID);
  };

  const blockChat = (data: any) => {
    const { chatID } = data;
    socket.broadcast.to(chatID).emit('chat blocked', chatID);
  };

  const joinChat = (data: { chatIds: string | string[]; username: string }) => {
    const connectToRoom = (chatId: string) => {
      socket.join(chatId);
      socket.broadcast.to(chatId).emit('user-joined', username);
    };

    const { chatIds, username } = data;
    if (Array.isArray(chatIds)) {
      chatIds.forEach(connectToRoom);
    } else {
      connectToRoom(chatIds);
    }
  };

  socket.on('send message', sendMessage);
  socket.on('stop chat', stopChat);
  socket.on('block chat', blockChat);
  socket.on('join-chat', joinChat);
};
