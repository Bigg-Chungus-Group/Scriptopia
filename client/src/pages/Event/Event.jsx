import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/Navbar";
import StudentNavbar from "../../components/student/Navbar";
import FacultyNavbar from "../../components/student/Navbar"; // !Change when faculty navbar is made
import { Box, Image, Skeleton } from "@chakra-ui/react";
import "./Event.css";

const Event = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [editPrivilege, setEditPrivilege] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const token = Cookies.get("token");
      const decoded = jwtDecode(token);
      if (decoded.role === "A" || decoded.perms.includes("MHI")) {
        setEditPrivilege(true);
      }
      setLoggedIn(true);
      setRole(decoded.role);
    } catch {
      setLoggedIn(false);
    }
  }, []);

  return (
    <>
      {role === "A" ? (
        <AdminNavbar />
      ) : role === "S" ? (
        <StudentNavbar />
      ) : role === "F" ? (
        <FacultyNavbar />
      ) : null}
      <Box className="GeneralEvents">
        <Image fallback={<Skeleton width="300px" height="250px" />} width="300px" height="250px"></Image>
      </Box>
    </>
  );
};

export default Event;
