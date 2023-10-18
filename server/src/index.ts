import { Server, Socket } from 'socket.io';
import { CallForHelpServer } from './server';

export type SocketFunction = (io: Server, socket: Socket) => void;

const registerAssignmentHandlers = require('./handlers/assignmentHandler');

const onConnect: SocketFunction = (io: Server, socket: Socket): void => {
  // register handlers here, see https://socket.io/docs/v4/server-application-structure/ for structure
  registerAssignmentHandlers(io, socket);
};

const app = new CallForHelpServer(onConnect);

export { app };
