import { ReactNode, useRef } from 'react';
import { io } from 'socket.io-client';
import { SocketCtx } from './SocketCtx';

const URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

const SocketProvider = (props: { children?: ReactNode }) => {
  console.log(URL);
  
  const socketRef = useRef(io(URL, { autoConnect: true }));

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current }}>{props.children}</SocketCtx.Provider>
  );
};

export default SocketProvider;
