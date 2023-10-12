import { ReactNode, useRef } from "react";
import { io } from "socket.io-client";
import { SocketCtx } from "./SocketCtx";

const SocketProvider = (props: { children?: ReactNode }) => {
  const socketRef = useRef(io({ autoConnect: false }));

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current }}>
      {props.children}
    </SocketCtx.Provider>
  );
};

export default SocketProvider;
