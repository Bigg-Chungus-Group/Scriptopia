import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth.jsx";
import "./assets/normalize.css";
import Code from "./pages/Code/Code.jsx";
import "./config.css"
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/editor/:lang/:id" element={<Code />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
