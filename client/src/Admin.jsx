import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import AdminHome from "./pages/Admin/Home/Home.jsx";
import AdminStudents from "./pages/Admin/Student/Students.jsx";
import AdminStudentsImport from "./pages/Admin/Student/Import/StudentImport.jsx";
import AdminFacultyImport from "./pages/Admin/Faculty/Import/FacultyImport.jsx";
import AdminFaculty from "./pages/Admin/Faculty/Faculty.jsx";

const Admin = () => {
  return (
    <>
      <Route path="/admin" element={<AdminHome />} />

      <Route path="/admin/students" element={<AdminStudents />} />
      <Route path="/admin/students/add" element={<AdminStudentsImport />} />
      <Route path="/admin/faculty/add" element={<AdminFacultyImport />} />
      <Route path="/admin/faculty" element={<AdminFaculty />} />

      <Route
        path="*"
        element={<div> Not Found or You do not have permission.</div>}
      />
    </>
  );
};

export default Admin;
