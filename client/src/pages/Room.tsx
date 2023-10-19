import { useEffect, useState } from 'react';
import { useSocketCtx } from '../context/socket/useSocketCtx';
import { useLocation } from 'react-router-dom';

const Room: React.FC = () => {
  const location = useLocation();
  const [companionName, setCompanionName] = useState<string | string[] | undefined>(location.state.companionName);
  const { socket } = useSocketCtx();

  useEffect(() => {
    socket.on('user-joined', (username: string) => {
      setCompanionName(username);
    });

    return () => {
      socket.off('user-joined');
    };
  }, [socket]);

  return <div>{companionName ?? "אף אחד עוד לא הצטרף"}</div>;
};

export default Room;
