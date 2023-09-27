/* IMPORTS */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";

import Auth from "./pages/Auth/Auth.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import Admin from "./Admin.jsx";
import Student from "./Student.jsx";
import "./config.css";

// Listeners
import { useEffect, useState } from "react";
import Fzt from "./pages/503/Fzt.jsx";
import Event from "./pages/Event/Event.jsx";
import socket, { io } from "./events/socketConnection";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

function App() {
  useEffect(() => {
    socket();
    const jwt = Cookies.get("token");
    if (jwt) {
      const id = jwtDecode(jwt).mid;
      io.emit("onRefreshedPage", id);
    }

    if (localStorage.getItem("chakra-ui-color-mode") === "dark") {
      import("./config-dark.css");
    } else {
      import("./config.css");
    }
  }, []);

  const [maintainanceMode, setMaintainanceMode] = useState(false);
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_ADDRESS, {
      method: "GET",
    }).then((res) => {
      if (res.status === 503) {
        setMaintainanceMode(true);
      }
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {maintainanceMode ? (
            <>
              <Route path="*" element={<Fzt />} />
              <Route path="/auth" element={<Auth />}/>
              {Admin()}
              {}
            </>
          ) : (
            <>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Fzf />} />
              {Admin()}
              {Student()}
              <Route path="/events/:id" element={<Event />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
