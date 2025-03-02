import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

export default function useSocket() {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
}
