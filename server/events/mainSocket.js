import { onLogin } from "./onLogin.js";
import { io } from "../index.js";

const mainSocket = () => {
  io.on("connection", (socket) => {
    socket.on("onLogin", (id) => {
      io.to(id).emit("logout");
      socket.join(id);
    });

    socket.on("onRefreshedPage", (id) => {
      console.log("Page Refreshed")
      socket.join(id)
      console.log("ROOMS")
      console.log(socket.rooms)
    })
  });

  io.on("disconnect", (socket) => {
    console.log("disconnect");
  });
};

export default mainSocket;
