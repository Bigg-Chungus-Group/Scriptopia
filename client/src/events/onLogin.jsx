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

const onLogin = (data) => {
 // logout();
};

export default onLogin;
