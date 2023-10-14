import { useContext } from 'react';

import { SocketCtx } from './SocketCtx';

export const useSocketCtx = () => useContext(SocketCtx);
