import socket from "socket.io-client";
import onLogin from "./onLogin";

export const io = socket(import.meta.env.VITE_SOCKET_ADDRESS);
const socketConnection = () => {
  io.on("connect", () => {
    io.on("logout", () => {
      onLogin();
    });
  });

  io.on("disconnect", () => {
  });
};

export default socketConnection;
