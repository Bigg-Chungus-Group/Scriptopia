import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";

import AdminHome from "./pages/Admin/Home/Home.jsx";
import AdminStudents from "./pages/Admin/Student/Students.jsx";
import AdminStudentsImport from "./pages/Admin/Student/Import/StudentImport.jsx";

const Admin = () => {
  return (
    <>
      <Route path="/admin" element={<AdminHome />} />

      <Route path="/admin/students" element={<AdminStudents/>}/>
      <Route path="/admin/students/import" element={<AdminStudentsImport />} />
      <Route path="*" element={<div> Not Found or You do not have permission.</div>}/>
    </>
  );
};

export default Admin;
