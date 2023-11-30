import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import axios from 'axios';

import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [inputValue, setInputValue] = useState(''); // State variable for input value

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Disconnected');
      setIsConnected(false);
    };

    const onMessageReceived = () => {
      console.log('message received');
    };

    const onPlayerJoined = () => {
      console.log('A new player joined:');
    };

    const onGameStarted = () => {
      console.log('Game has started!');
    };

    const onGameState = (data: string) => {
      const gameState = JSON.parse(data);
      console.log("Received Game State:", gameState);
    }

    const onTurnStart = () => {
      console.log("it's your turn!");
    }

    const onTurnWaiting = (playerId: string) => {
      console.log(`It's ${playerId}'s turn!`);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messageReceived', onMessageReceived);
    socket.on('playerJoined', onPlayerJoined);
    socket.on('gameStarted', onGameStarted);
    socket.on('gameState', onGameState);
    socket.on('turnStart', onTurnStart);
    socket.on('turnWaiting', onTurnWaiting)

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messageReceived', onMessageReceived);
      socket.off('playerJoined', onPlayerJoined);
      socket.off('gameStarted', onGameStarted);
      socket.off('gameState', onGameState);
      socket.off('turnStart', onTurnStart);
      socket.off('turnWaiting', onTurnWaiting)
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value.replace(/[^0-9]/g, ''));
  };

  const handleButtonClick = () => {
    console.log('Button clicked with value:', inputValue);
    socket.emit('joinRoom', { roomCode: inputValue });
  };

  const hostGame = async () => {
    console.log('Awaiting hostRoom');
    const { data } = await axios.get('http://localhost:3000/getRoomCode');
    const { roomCode } = data;
    console.log('Trying to join room with code:', roomCode);
    socket.emit('hostRoom', { roomCode });
  };

  const sendMessage = () => {
    console.log('sending message');
    socket.emit('message');
  };

  const startGame = () => {
    console.log('Starting game clicked');
    socket.emit('startGame');
  };

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      <button onClick={hostGame}>Host</button>
      <form>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter numbers"
        />
        <button type="button" onClick={handleButtonClick}>
          Join
        </button>
        <button type="button" onClick={sendMessage}>
          Send Message
        </button>
        <button type="button" onClick={startGame}>
          Start Game
        </button>
      </form>
    </div>
  );
}

export default App;
