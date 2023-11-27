import { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';

import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Disconnected');
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  });

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
    </div>
  );
}

export default App;
