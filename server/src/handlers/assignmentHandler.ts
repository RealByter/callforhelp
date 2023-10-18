import { Server, Socket } from 'socket.io';

const registerAssignmentHandlers = (io: Server, socket: Socket) => {
  const joinChat = ({ chatId, username }: { chatId: string; username: string }) => {
    socket.join(chatId);
    socket.broadcast.to(chatId).emit('user_connected', username);
  };

  const createChat = (chatId: string) => {
    socket.join(chatId);
  };

  socket.on('join_chat', joinChat);
  socket.on('create_chat', createChat);
};

export default registerAssignmentHandlers;
