import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Card } from './types/Card';
import axios from 'axios';

import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [inputValue, setInputValue] = useState(''); // State variable for input value
  const [hand, setHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [isCurrentTurn, setIsCurrentTurn] = useState(false);
  const [needsColorCoice, setNeedsColorChoice] = useState(false);
  const [activeColor, setActiveColor] = useState('');
  const [activeNumber, setActiveNumber] = useState('');
  const [canChallenge, setCanChallenge] = useState(false);

  const colors = ['Red', 'Blue', 'Green', 'Yellow'];

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
      console.log('Received Game State:', gameState);
      let hand;

      for (const player of gameState.players) {
        console.log(player.hand);
        if (player.hand) {
          hand = player.hand;
        }
      }

      if (gameState.discardPile) {
        setDiscardPile(gameState.discardPile);
      }

      console.log('Your hand is:', hand);
      setHand(hand);

      setActiveColor(gameState.activeColor);
      setActiveNumber(gameState.activeNumber);
    };

    const onTurnStart = () => {
      console.log("it's your turn!");
      setIsCurrentTurn(true);
    };

    const onTurnWaiting = (playerId: string) => {
      console.log(`It's ${playerId}'s turn!`);
      setIsCurrentTurn(false);
    };

    const onChooseColor = () => {
      console.log('Player needs to pick another color');
      setNeedsColorChoice(true);
    };

    const onChallenge = () => {
      console.log('You can challenge this Draw Four');
      setCanChallenge(true);
    };

    const onChallengeWin = () => {
      setCanChallenge(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messageReceived', onMessageReceived);
    socket.on('playerJoined', onPlayerJoined);
    socket.on('gameStarted', onGameStarted);
    socket.on('gameState', onGameState);
    socket.on('turnStart', onTurnStart);
    socket.on('turnWaiting', onTurnWaiting);
    socket.on('chooseColor', onChooseColor);
    socket.on('challenge', onChallenge);
    socket.on('challengeWin', onChallengeWin);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messageReceived', onMessageReceived);
      socket.off('playerJoined', onPlayerJoined);
      socket.off('gameStarted', onGameStarted);
      socket.off('gameState', onGameState);
      socket.off('turnStart', onTurnStart);
      socket.off('turnWaiting', onTurnWaiting);
      socket.off('chooseColor', onChooseColor);
      socket.off('challenge', onChallenge);
      socket.off('challengeWin', onChallengeWin);
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

  const playCard = (id: number, card: Card) => {
    console.log('Playing card with id:', id);
    console.log('emitting');
    socket.emit('playCard', { id, suit: card.suit, rank: card.rank });
  };

  const chooseColor = (color: string) => {
    console.log('Selected Color:', color);
    socket.emit('additionalAction', { action: 'colorChosen', value: color });
    setNeedsColorChoice(false);
  };

  const drawCard = () => {
    socket.emit('drawCard');
  };

  const handleChallenge = () => {
    setCanChallenge(false);
    socket.emit('confirmChallenge');
  };

  const handleDontChallenge = () => {
    setCanChallenge(false);
    socket.emit('discardChallenge');
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
      {activeColor ? <p>{activeColor}</p> : null}
      {activeNumber ? <p>{activeNumber}</p> : null}
      <h1>Play Pile</h1>
      {canChallenge ? (
        <div>
          <button type="button" onClick={handleChallenge}>
            Challenge
          </button>
          <button type="button" onClick={handleDontChallenge}>
            Don't Challenge
          </button>
        </div>
      ) : null}
      {discardPile.length > 0 ? (
        <h2>
          {discardPile[discardPile.length - 1].suit} -{' '}
          {discardPile[discardPile.length - 1].rank}
        </h2>
      ) : null}
      <br></br>
      {hand.length > 0
        ? hand.map((card, i) => {
            return (
              <button
                type="button"
                key={i.toString()}
                onClick={() => playCard(i, card)}
                disabled={!isCurrentTurn || canChallenge}
              >
                {card.suit} - {card.rank}
              </button>
            );
          })
        : null}
      <br></br>
      {needsColorCoice
        ? colors.map((color, i) => {
            return (
              <button
                type="button"
                key={i.toString()}
                onClick={() => chooseColor(color)}
              >
                {color}
              </button>
            );
          })
        : null}
      <br></br>
      <button
        type="button"
        onClick={drawCard}
        disabled={!isCurrentTurn || canChallenge}
      >
        Draw Card
      </button>
    </div>
  );
}

export default App;
