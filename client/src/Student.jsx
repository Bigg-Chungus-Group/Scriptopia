import { Route } from "react-router-dom";
import React from "react";

import StudentProfile from "./pages/Profile/Profile.jsx";
import StudentHome from "./pages/Student/Home/Home.jsx";
import StudentCertificates from "./pages/Student/Certificates/Certificates.jsx";
import StudentSettings from "./pages/Student/Settings/Settings.jsx";
import StudentHouses from "./pages/Houses/Houses.jsx";
import StudentHouse from "./pages/Houses/House/House.jsx";

const Student = () => {
  return (
    <>
      {/*}<Route path="/editor/:lang/:id" element={<StudentCode />} />{*/}
      {/*}<Route path="/practice" element={<StudentPractice />} />{*/}
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/" element={<StudentHome />} />
      <Route path="/certificates" element={<StudentCertificates />} />
      <Route path="/settings" element={<StudentSettings />} />
      <Route path="/houses" element={<StudentHouses />} />
      <Route path="/houses/:id" element={<StudentHouse />} />

      <Route
        path="*"
        element={<div> Not Found or You do not have permission.</div>}
      />
    </>
  );
};

export default Student;
