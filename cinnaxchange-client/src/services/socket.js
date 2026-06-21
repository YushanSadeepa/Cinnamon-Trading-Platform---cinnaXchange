import { io } from "socket.io-client";

// Single shared socket instance — imported by any component that needs real-time
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  autoConnect: true,
  withCredentials: true,
});

export default socket;