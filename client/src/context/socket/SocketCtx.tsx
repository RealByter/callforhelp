import { createContext } from "react";
import { Socket } from "socket.io-client";

export interface ISocketCtxState {
  socket: Socket;
}

export const SocketCtx = createContext<ISocketCtxState>({} as ISocketCtxState);
