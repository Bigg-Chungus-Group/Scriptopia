import socket from "socket.io-client";
import onLogin from "./onLogin";

export const io = socket("http://localhost:5000");
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
