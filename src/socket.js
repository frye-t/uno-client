import { io, Socket } from 'socket.io-client';
import { serverURL } from './constants';

export const socket = io(serverURL, { autoConnect: false });
