import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import StudentProfile from "./pages/Student/Profile/Profile.jsx";
import StudentHome from "./pages/Student/Home/Home.jsx";
import StudentCertificates from "./pages/Student/Certificates/Certificates.jsx";
import StudentCertificate from "./pages/Student/Certificates/Certificate/Certificate.jsx";

const Student = () => {
  return (
    <>
      {/*}<Route path="/editor/:lang/:id" element={<StudentCode />} />{*/}
      {/*}<Route path="/practice" element={<StudentPractice />} />{*/}
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/" element={<StudentHome />} />
      <Route path="/certificates" element={<StudentCertificates />} />
      <Route path="/certificates/:id" element={<StudentCertificate />} />

      <Route
        path="*"
        element={<div> Not Found or You do not have permission.</div>}
      />
    </>
  );
};

export default Student;
