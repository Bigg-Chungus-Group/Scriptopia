import { Route } from "react-router-dom";
import React from "react";
import FacultyHome from "./pages/faculty/Home/Home.jsx";
import Certificates from "./pages/Faculty/Certificates/Certificates.jsx";
import Enrollments from "./pages/Faculty/Enrollments/Enrollments.jsx";
import FacultySettings from "./pages/Faculty/Settings/Settings.jsx";

const Faculty = () => {
  return (
    <>
      <Route path="/faculty" element={<FacultyHome />} />
      <Route path="/faculty/certificates" element={<Certificates />} />
      <Route path="/faculty/enrollments" element={<Enrollments />} />
      <Route path="/faculty/settings" element={<FacultySettings />} />
    </>
  );
};

export default Faculty;
