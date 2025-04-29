// src/sockets/socket.ts
import { io } from "socket.io-client";

// **CRA** only exposes REACT_APP_ vars
const SOCKET_URL = process.env.REACT_APP_API_URL!;
export default io(SOCKET_URL);
