import { useEffect } from 'react';
import { useSocketCtx } from '../context/socket/useSocketCtx';

const Room: React.FC = () => {
  const { socket } = useSocketCtx();

  useEffect(() => {
    socket.on('user-joined', (username: string) => {
      console.log('user joined: ', username);
    });

    return () => {
      socket.off('user-joined');
    };
  }, [socket]);

  return <div></div>;
};

export default Room;
