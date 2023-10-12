import { Socket } from 'socket.io';
import { CallForHelpServer } from './server';

const onConnect = (socket: Socket): void => {
     // register handlers here, see https://socket.io/docs/v4/server-application-structure/ for structure
}

const app = new CallForHelpServer(onConnect);

export { app }
