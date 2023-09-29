import { Route } from "react-router-dom";
import React from "react";
import FacultyHome from "./pages/Faculty/Home/Home.jsx";

const Faculty = () => {
  return (
    <>
      <Route path="/faculty" element={<FacultyHome />} />
    </>
  );
};

export default Faculty;
