import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth.jsx";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";
import Code from "./pages/Code/Code.jsx";
import "./config.css";
import Profile from "./pages/Profile/Profile.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import Home from "./pages/Home/Home.jsx";
import Practice from "./pages/Practice/Practice.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/editor/:lang/:id" element={<Code />} />
            <Route path="*" element={<Fzf />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
