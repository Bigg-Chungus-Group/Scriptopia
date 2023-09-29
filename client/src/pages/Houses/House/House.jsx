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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  useDisclosure,
  Link,
  Input,
  Textarea,
  InputLeftAddon,
  InputGroup,
  InputRightElement,
  FormLabel,
  FormControl,
  InputLeftElement,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";
import AdminNavbar from "../../../components/admin/Navbar";
import FacultyNavbar from "../../../components/student/Navbar";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { Form } from "react-router-dom";

const House = () => {
  const [houses, setHouses] = useState(null);
  const [members, setMembers] = useState(null);
  const [facCord, setFacCord] = useState(null);
  const [studentCord, setStudentCord] = useState(null);
  const houseID = window.location.pathname.split("/")[2];
  const [totalpoints, setTotalPoints] = useState(0);
  const [role, setRole] = useState(null); // [student, faculty, admin
  const toast = useToast();

  const [houseName, setHouseName] = useState(null);
  const [houseColor, setHouseColor] = useState(null);
  const [houseAbstract, setHouseAbstract] = useState(null);
  const [houseDesc, setHouseDesc] = useState(null);
  const [facCordID, setFacCordID] = useState(null);
  const [studentCordID, setStudentCordID] = useState(null);
  const [update, setUpdate] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  let jwt;
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      jwt = jwtDecode(token);
      setRole(jwt.role);
    }

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          return await res.json();
        } else {
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .then((data) => {
        setHouses(data.house);
        setMembers(data.members);
        setFacCord(data.facCordInfo);
        setStudentCord(data.studentCordInfo);

        console.log(data);

        setHouseName(data.house.name);
        setHouseColor(data.house.color);
        setHouseAbstract(data.house.abstract);
        setHouseDesc(data.house.desc);
        setFacCordID(data.facCordInfo.mid);
        setStudentCordID(data.studentCordInfo.mid);
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
  }, [update]);

  useEffect(() => {
    if (houses) {
      for (const year in houses.points) {
        for (const month in houses.points[year]) {
          const points =
            houses.points[year][month].internal +
            houses.points[year][month].external +
            houses.points[year][month].events;
          setTotalPoints((prev) => prev + points);
        }
      }
    }
  }, [houses]);

  useEffect(() => {
    if (members) {
      members.forEach((member) => {
        let totalPoints = 0;
        for (const year in member.contr) {
          for (const month in member.contr[year]) {
            const points =
              member.contr[year][month]?.internal +
              member.contr[year][month]?.external +
              member.contr[year][month]?.events;
            totalPoints += points;
          }
        }
        member.totalPoints = totalPoints;
      });

      members.sort((a, b) => b.totalPoints - a.totalPoints);
    }
  });

  const updateHouse = () => {
    if (
      !houseName ||
      !houseColor ||
      !houseAbstract ||
      !facCordID ||
      !studentCordID
    ) {
      toast({
        title: "Error",
        description: "Please fill all the required fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    onSettingsClose();
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/houses/${houseID}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: houseName,
        color: houseColor,
        abstract: houseAbstract,
        desc: houseDesc,
        fc: facCordID,
        sc: studentCordID,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "House updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setUpdate((prev) => !prev);
        return await res.json();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    });
  };
  [];

  if (houses) {
    return (
      <>
        {role === "S" ? (
          <Navbar />
        ) : role == "F" ? (
          <FacultyNavbar />
        ) : role == "A" ? (
          <AdminNavbar />
        ) : null}
        <Box className="StudentHouse">
          <Box className="top">
            <Box className="cover" bg={houses.color}>
              <Flex
                className="details"
                align="flex-start"
                gap="10px"
                direction="column"
              >
                <Avatar height="170px" width="170px" src={houses.logo}></Avatar>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  width="70vw"
                >
                  <Flex direction="column">
                    <Heading fontSize="40px" fontWeight="600">
                      {houses.name} House
                    </Heading>
                    <Flex align="center" gap="10px">
                      <a href={`/profile/${facCord?.id}`}>
                        <Text>
                          @{facCord?.fname} {facCord?.lname}
                        </Text>
                      </a>

                      <a href="">
                        <i className="fa-brands fa-linkedin"></i>
                      </a>
                      <a href="">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a href="">
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    </Flex>
                  </Flex>
                  <Box>
                    {role === "A" || jwt?.perms.includes("MH") ? (
                      <Text cursor="pointer" onClick={onSettingsOpen}>
                        <i className="fa-solid fa-pen"></i>
                      </Text>
                    ) : null}
                    <Text fontSize="17.5px" fontWeight="500">
                      {houses.members.length} Members
                    </Text>
                    <Text fontSize="17.5px" fontWeight="500">
                      {totalpoints} Points
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Box>

          <Flex className="middle" height="220px" gap="20px">
            <Box className="left" width="50%" bg={houses.color}>
              <Heading fontSize="20px">{houses.abstract}</Heading>
              <Text mt="15px">{houses.desc}</Text>
            </Box>
            <Flex
              className="right"
              width="50%"
              direction="column"
              justifyContent="space-around"
              fontSize="18px"
            >
              <Text>
                Internal Certifications: {houses.certificates.internal}
              </Text>
              <Text>
                External Certifications: {houses.certificates.external}
              </Text>
              <Text>Events: {houses.certificates.events}</Text>
            </Flex>
          </Flex>

          <Box className="table" margin="80px">
            <Box className="tableTitle">House Ranking</Box>
            <Table variant="unstyled" color="#848484">
              <Thead>
                <Tr>
                  <Td>#</Td>
                  <Td>Name</Td>
                  <Td>Moodle ID</Td>
                  <Td>Points</Td>
                </Tr>
              </Thead>
              <Tbody>
                {members.slice(0, 5).map((member, index) => (
                  <Tr key={member.mid}>
                    <Td>{index + 1}</Td>
                    <Td>
                      {member.fname} {member.lname}
                    </Td>
                    <Td>{member.mid}</Td>
                    <Td>{member.totalPoints}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {members.length > 5 ? (
              <Box
                float="right"
                height="32.8px"
                borderBottom="1px solid #8484849c"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Text
                  textTransform="lowercase"
                  fontSize="15px"
                  mr="15px"
                  onClick={onOpen}
                  cursor="pointer"
                >
                  View All
                </Text>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{houses.name} Members</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflow="auto">
              <Table variant="unstyled" color="#848484">
                <Thead>
                  <Tr>
                    <Td>#</Td>
                    <Td>Name</Td>
                    <Td>Moodle ID</Td>
                    <Td>Points</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {members.map((member, index) => (
                    <Tr key={member.mid}>
                      <Td>{index + 1}</Td>
                      <Td>
                        {member.fname} {member.lname}
                      </Td>
                      <Td>{member.mid}</Td>
                      <Td>{member.totalPoints}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{houses.name} Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap="20px">
              <Text fontSize="13px">
                <i
                  className="fa-solid fa-asterisk"
                  style={{ fontSize: "10px", marginRight: "5px" }}
                ></i>{" "}
                Required
              </Text>
              <Text fontSize="13px">
                <i
                  className="fa-solid fa-lock"
                  style={{ fontSize: "9px", marginRight: "5px" }}
                ></i>{" "}
                Requires Administrator Rights
              </Text>

              <Flex gap="20px">
                <InputGroup>
                  <InputLeftAddon>House Name*</InputLeftAddon>
                  <Input
                    placeholder="House Name*"
                    value={houseName}
                    onChange={(e) => {
                      setHouseName(e.target.value);
                    }}
                    isDisabled={role !== "A"}
                  />
                  <InputRightElement>
                    <i
                      className="fa-solid fa-lock"
                      style={{ fontSize: "9px", marginRight: "5px" }}
                    ></i>{" "}
                  </InputRightElement>
                </InputGroup>

                <InputGroup width="70%">
                  <InputLeftAddon>Color Hex* #</InputLeftAddon>
                  <Input
                    placeholder="House Color Hex*"
                    value={houseColor}
                    onChange={(e) => {
                      setHouseColor("#" + e.target.value);
                    }}
                  />
                </InputGroup>
              </Flex>

              <InputGroup>
                <InputLeftAddon>House Abstract*</InputLeftAddon>
                <Input
                  placeholder="House Abstract*"
                  value={houseAbstract}
                  onChange={(e) => {
                    setHouseAbstract(e.target.value);
                  }}
                />
              </InputGroup>

              <FormControl>
                <FormLabel>House Description</FormLabel>
                <Textarea
                  placeholder="House Description"
                  value={houseDesc}
                  onChange={(e) => {
                    setHouseDesc(e.target.value);
                  }}
                />
              </FormControl>

              <Flex gap="20px">
                <FormControl>
                  <FormLabel>Faculty Coordinator Moodle ID*</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>

                    <Input
                      placeholder="Faculty Coordinator Moodle ID*"
                      list="facSelect"
                      value={facCordID}
                      onChange={(e) => {
                        setFacCordID(e.target.value);
                      }}
                      isDisabled={role !== "A"}
                    />
                    <InputRightElement>
                      <i
                        className="fa-solid fa-lock"
                        style={{ fontSize: "9px", marginRight: "5px" }}
                      ></i>{" "}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Student Coordinator Moodle ID*</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>@</InputLeftAddon>
                    <Input
                      placeholder="Student Coordinator Moodle ID*"
                      list="stuSelect"
                      value={studentCordID}
                      onChange={(e) => {
                        setStudentCordID(e.target.value);
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onSettingsClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={updateHouse}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
};

export default House;
