import React from "react";
import "./Home.css";
import Navbar from "../../../components/faculty/Navbar.jsx";
import { Box, Text } from "@chakra-ui/react";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Home = () => {
  const decoded = useAuthCheck("F");
  console.log(decoded);

  return (
    <>
      <Navbar />
      <Box className="FacultyHome">
        <Text>Welcome {decoded?.fname}!</Text>
        <Text>Your Permissions: </Text>
        {decoded?.perms?.map((perm) => (
          <Text>{perm}</Text>
        ))}
      </Box>
    </>
  );
};

export default Home;
