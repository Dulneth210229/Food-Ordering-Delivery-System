// src/sockets/socket.ts
import { io } from 'socket.io-client';

// ensure .env has REACT_APP_API_URL=http://localhost:5000
const SOCKET_URL = process.env.REACT_APP_API_URL!;
const socket = io(SOCKET_URL);

export default socket;
