/* IMPORTS */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button, ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./theme.js";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";

import Auth from "./pages/Auth/Auth.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import Admin from "./Admin.jsx";
import Student from "./Student.jsx";
import "./config.css";

// Listeners
import onLogin from "./events/onLogin.jsx";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { connect } from "react-redux";
import { enableDarkMode, disableDarkMode } from "./redux/actions";
import Cookies from "js-cookie";
import Fzt from "./pages/503/Fzt.jsx";

function App() {
  useEffect(() => {
    onLogin();
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
      console.log(res.status);
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
              {Admin()}
            </>
          ) : (
            <>
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Fzf />} />
              {Admin()}
              {Student()}
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
