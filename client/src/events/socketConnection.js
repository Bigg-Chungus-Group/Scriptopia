import socket from "socket.io-client";
import onLogin from "./onLogin";

export const io = socket(import.meta.env.VITE_SOCKET_ADDRESS);
const socketConnection = () => {
  io.on("connect", () => {
    console.log("connected");

    io.on("logout", () => {
      console.log("newLogin");
      onLogin();
    });
  });

  io.on("disconnect", () => {
    console.log("disconnected");
  });
};

export default socketConnection;
