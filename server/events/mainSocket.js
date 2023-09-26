import { onLogin } from "./onLogin.js";
import { io } from "../index.js";

const mainSocket = () => {
  io.on("connection", (socket) => {
    socket.on("onLogin", (id) => {
      io.to(id).emit("logout");
      socket.join(id);
    });
  });

  io.on("disconnect", (socket) => {
    console.log("disconnect");
  });
};

export default mainSocket;
