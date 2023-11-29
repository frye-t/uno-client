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

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  messageReceived: () => void;
  playerJoined: () => void;
  gameStarted: () => void;
}

interface ClientToServerEvents {
  hostRoom: (data: RoomData) => void;
  joinRoom: (data: RoomData) => void;
  message: () => void;
  startGame: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'localhost:3000',
  { autoConnect: false }
);
