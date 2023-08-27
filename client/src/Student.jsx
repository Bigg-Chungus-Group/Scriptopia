import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import StudentProfile from "./pages/Student/Profile/Profile.jsx";
import StudentCode from "./pages/Student/Code/Code.jsx";
import StudentHome from "./pages/Student/Home/Home.jsx";
import StudentPractice from "./pages/Student/Practice/Practice.jsx";

const Student = () => {
  return (
    <>
      {/*}<Route path="/editor/:lang/:id" element={<StudentCode />} />{*/}
      {/*}<Route path="/practice" element={<StudentPractice />} />{*/}
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/" element={<StudentHome />} />
      <Route path="*" element={<div> Not Found or You do not have permission.</div>}/>
    </>
  );
};

export default Student;
