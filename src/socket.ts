import { io, Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

interface RoomData {
  roomCode: string;
  options? :ServerOptions;
}

interface ServerOptions {
  option1: string;
}

interface CardData {
  id: number;
  suit: string;
  rank: string;
}

interface AdditionalActionData {
  action: string;
  value: string;
}

interface ServerToClientEvents {
  messageReceived: () => void;
  playerJoined: () => void;
  gameStarted: () => void;
  gameState: (data: string) => void;
  turnStart: () => void;
  turnWaiting: (playerId: string) => void;
  chooseColor: () => void;
  challenge: () => void;
  challengeWin: () => void;
}

interface ClientToServerEvents {
  hostRoom: (data: RoomData) => void;
  joinRoom: (data: RoomData) => void;
  message: () => void;
  startGame: () => void;
  playCard: (data: CardData) => void;
  additionalAction: (data: AdditionalActionData) => void;
  drawCard: () => void;
  confirmChallenge: () => void;
  discardChallenge: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'localhost:3000',
  { autoConnect: false }
);
