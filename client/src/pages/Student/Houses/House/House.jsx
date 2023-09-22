import React, { useEffect, useState } from "react";
import "./House.css";
import { Box, Heading, useToast } from "@chakra-ui/react";
import Navbar from "../../../../components/student/Navbar";

const House = () => {
  const [houses, setHouses] = useState([]);
  const houseID = window.location.pathname.split("/")[2];
  const toast = useToast();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/houses/${houseID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        setHouses(data);
      })
      .catch((err) => {
        {
          console.log(err);
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  });

  return (
    <>
      <Navbar />
      <Box className="StudentHouse">
        <Box className="left">
            <Heading>{houses.name} House</Heading>
            
        </Box>
      </Box>
    </>
  );
};

export default House;
