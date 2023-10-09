import { io } from "socket.io-client";
export const socket = io({
  path: process.env.REACT_APP_API_BASE_URL,
  transports: ["websocket"],
});
