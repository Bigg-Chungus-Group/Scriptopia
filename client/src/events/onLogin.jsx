import io from "socket.io-client";
import Cookies from "js-cookie";

const logout = () => {
  Cookies.remove("token", {
    path: "/",
    domain: import.meta.env.VITE_COOKIE_DOMAIN,
  });
  Cookies.remove("token", {
    path: "/",
    domain: import.meta.env.VITE_COOKIE_DOMAIN2,
  });
  window.location.href = "/auth?err=newlcn";
};

const onLogin = () => {
  const socket = io(import.meta.env.VITE_BACKEND_ADDRESS, {
    transports: ["websocket"],
  });

  socket.on("newLogin", () => {
    logout();
  });
};

export default onLogin;
