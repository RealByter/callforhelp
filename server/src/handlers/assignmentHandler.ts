import { Server, Socket } from 'socket.io';

const registerAssignmentHandlers = (io: Server, socket: Socket) => {
  const joinChat = (chatIds: string[], username: string) => {
    socket.join(chatIds);
    // it is impossible to emit to many rooms that way.
    socket.broadcast.to(chatIds).emit('user-joined', username);
  };

  socket.on('join-chat', joinChat);
};

export default registerAssignmentHandlers;
