/* IMPORTS */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";
import "./config.css";

import Auth from "./pages/Auth/Auth.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import Admin from "./Admin.jsx";
import Student from "./Student.jsx";

// Listeners
import onLogin from "./events/onLogin.jsx";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    onLogin();
  }, []);

  return (
    <>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Fzf />} />
            {Admin()}
            {Student()}
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
