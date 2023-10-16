import { ReactNode, useRef } from 'react';
import { io } from 'socket.io-client';
import { SocketCtx } from './SocketCtx';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

const SocketProvider = (props: { children?: ReactNode }) => {
  const socketRef = useRef(io(URL, { autoConnect: false }));

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current }}>{props.children}</SocketCtx.Provider>
  );
};

export default SocketProvider;
