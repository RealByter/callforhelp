import { Server, Socket } from 'socket.io';
import { CallForHelpServer } from './server';
import chatHandler from "./handlers/chatHandler";
import registerAssignmentHandlers from './handlers/assignmentHandler';

export type SocketFunction = (io: Server, socket: Socket) => void;

const onConnect: SocketFunction = (io: Server, socket: Socket): void => {
  // register handlers here, see https://socket.io/docs/v4/server-application-structure/ for structure
  chatHandler(io, socket);
};

const app = new CallForHelpServer(onConnect);

export { app };
