import { Server, Socket } from 'socket.io';

const registerAssignmentHandlers = (io: Server, socket: Socket) => {
  const joinChat = (chatIds: string[], username: string) => {
    socket.join(chatIds);
    socket.broadcast.to(chatIds).emit('user-joined', username);
  };

  socket.on('join-chat', joinChat);
};

export default registerAssignmentHandlers;
