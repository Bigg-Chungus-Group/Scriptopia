import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth.jsx";
import "./assets/normalize.css";
import "./assets/fa/css/all.css";
import StudentCode from "./pages/student/Code/Code.jsx";
import "./config.css";
import StudentProfile from "./pages/student/Profile/Profile.jsx";
import Fzf from "./pages/404/Fzf.jsx";
import StudentHome from "./pages/student/Home/Home.jsx";
import StudentPractice from "./pages/student/Practice/Practice.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.js";
import AdminHome from "./pages/admin/Home/Home.jsx";

function App() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/editor/:lang/:id" element={<StudentCode />} />
            <Route path="*" element={<Fzf />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/" element={<StudentHome />} />
            <Route path="/practice" element={<StudentPractice />} />
            <Route path="/admin" element={<AdminHome />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
