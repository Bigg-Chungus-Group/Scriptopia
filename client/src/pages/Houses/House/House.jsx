import React, { useEffect, useState } from "react";
import "./House.css";
import {
  Box,
  Flex,
  Heading,
  useToast,
  Image,
  Text,
  Avatar,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";

const House = () => {
  const [houses, setHouses] = useState([]);
  const houseID = window.location.pathname.split("/")[2];
  const toast = useToast();
  /*

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
        console.log(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  });*/

  return (
    <>
      <Navbar />
      <Box className="StudentHouse">
        <Box className="top">
          <Box className="cover">
            <Flex
              className="details"
              align="flex-start"
              gap="10px"
              direction="column"
            >
              <Avatar height="130px" width="130px"></Avatar>
           <Flex justifyContent="space-between" alignItems="center" width="85vw">
               <Flex direction="column">
                <Heading fontSize="40px" fontWeight="600">
                  Violet House
                </Heading>
                <Flex align="center" gap="10px">
                  <Text>@faculty_name</Text>

                  <i className="fa-brands fa-linkedin"></i>
                  <i className="fa-brands fa-instagram"></i>
                  <i className="fa-brands fa-twitter"></i>
                </Flex>
              </Flex>
              <Box>
                <Text>54 Members</Text>
                <Text>48465 Points</Text>
              </Box>
           </Flex>
            </Flex>
          </Box>
        </Box>
        <Flex className="middle">
          <Box className="left"></Box>
          <Box className="right"></Box>
        </Flex>
      </Box>
    </>
  );
};

export default House;
