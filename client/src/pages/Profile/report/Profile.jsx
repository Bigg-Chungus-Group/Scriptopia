import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import "./Profile.css";
import {
  Avatar,
  Box,
  Flex,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Heading,
  Link,
  Table,
  Thead,
  Tr,
  Td,
  useToast,
  Tbody,
  InputLeftAddon,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Portal,
} from "@chakra-ui/react";

import Chart from "chart.js/auto";
import Loader from "../../../components/Loader";
import AvatarEditor from "react-avatar-editor";
import jsPDF from "jspdf";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [user, setUser] = useState({});
  const [houses, setHouses] = useState([]);
  const [userHouse, setUserHouse] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [events, setEvents] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsObj, setPointsObj] = useState({});
  const toast = useToast();

  useEffect(() => {
    const jwt = Cookies.get("token");
    if (!jwt) {
      window.location.href = "/auth";
    }
  }, []);

  useEffect(() => {
    let id = window.location.href.split("/").slice(4)[0];
    if (!id) {
      try {
        const token = Cookies.get("token");
        const jwt = jwtDecode(token);
        id = jwt.mid;
      } catch {
        console.error("Error");
        toast({
          title: "Error",
          description: "Error fetching profile data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/generator/${id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data?.user);
        setHouses(data?.allHouses);
        setUserHouse(data?.userHouse);
        setCertifications(data?.certifications);
        setLoading(false);
        setEmail(data?.user?.email);
        setLinkedin(data?.user?.linkedin);
        setGithub(data?.user?.github);
        setEvents(data?.events);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Error fetching dashboard data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [update]);

  function calculateTotalPoints(data) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // Get the current year

    let totalInternalPoints = 0;
    let totalExternalPoints = 0;
    let totalEventsPoints = 0;

    if (data && data.points && data.points[currentYear?.toString()]) {
      const monthlyPoints = data.points[currentYear?.toString()];
      for (const month in monthlyPoints) {
        if (monthlyPoints.hasOwnProperty(month)) {
          // Separate internal, external, and events points
          const {
            internal = 0,
            external = 0,
            events = 0,
          } = monthlyPoints[month];

          // Add them to their respective totals
          totalInternalPoints += internal;
          totalExternalPoints += external;
          totalEventsPoints += events;
        }
      }
    }

    setTotalPoints(
      totalInternalPoints + totalExternalPoints + totalEventsPoints
    );

    return {
      totalInternal: totalInternalPoints,
      totalExternal: totalExternalPoints,
      totalEvents: totalEventsPoints,
    };
  }

  useEffect(() => {
    setPointsObj(calculateTotalPoints(userHouse));
  }, [userHouse]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        window.print();
        const originalProfile = window.location.href.split("/").slice(0, 5);
        window.location.href = originalProfile.join("/")
      }, 1000);
    }
  }, [loading]);

  /* useEffect(() => {
    html2pdf(document.getElementById("g"), {
      margin: 0.5,
      filename: "report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    });
  }, []);*/

  if (!loading) {
    return (
      <>
        <Flex
          className="GenerateProfile"
          id="g"
          align="center"
          direction="column"
          gap="25px"
        >
          <Heading fontSize="25px">Scriptopia Student Report</Heading>
          <Flex alignSelf="flex-start" pl="20px" gap="20px">
            <Flex>
              <Avatar size="2xl" name={user?.name} src={user?.profilePicture} />
              <Avatar
                size="md"
                ml="-40px"
                alignSelf="flex-end"
                mb="-10px"
                name={userHouse?.name}
                src={userHouse?.logo}
              />
            </Flex>
            <Flex direction="column" gap="1px">
              <Text fontSize="20px" fontWeight="bold">
                {user?.fname} {user?.lname}
              </Text>
              <Text fontSize="15px">
                {user?.mid} - {user?.dse ? "DSE" : null}
              </Text>
              <Text fontSize="15px">
                {user?.gender ? user?.gender.slice(0, 1).toUpperCase() + user?.gender.slice(1) : null}
              </Text>
              <Text>{userHouse ? (`Member of ${userHouse?.name} House`) : null}</Text>

              <Flex direction="row" align="center" gap="10px">
                <Text fontSize="15px" fontWeight="bold">
                  {userHouse?.houseName}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex gap="20px">
            <Table variant="striped" size="sm" width="fit-content">
              <Thead>
                <Tr>
                  <Td>Certificate Category</Td>
                  <Td isNumeric>Total Certificates</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Internal Certifications</Td>
                  <Td isNumeric>{user?.certificates?.internal}</Td>
                </Tr>
                <Tr>
                  <Td>External Certifications</Td>
                  <Td isNumeric>{user?.certificates?.external}</Td>
                </Tr>
                <Tr>
                  <Td>Events</Td>
                  <Td isNumeric>{user?.certificates?.event}</Td>
                </Tr>
              </Tbody>
            </Table>
            <Table variant="striped" size="sm" width="fit-content">
              <Thead>
                <Tr>
                  <Td>Certificate Category</Td>
                  <Td isNumeric>Points Obtained</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Internal Certifications</Td>
                  <Td isNumeric>{pointsObj?.totalInternal}</Td>
                </Tr>
                <Tr>
                  <Td>External Certifications</Td>
                  <Td isNumeric>{pointsObj?.totalExternal}</Td>
                </Tr>
                <Tr>
                  <Td>Events</Td>
                  <Td isNumeric>{pointsObj?.totalEvents}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Flex>

          <Box p="20px" width="100%">
            <Text>Email:</Text> <Text textDecor="underline">{email}</Text>
            <Text>LinkedIn:</Text> <Text textDecor="underline">{linkedin}</Text>
            <Text>Github:</Text> <Text textDecor="underline">{github}</Text>
          </Box>

          <Text className="headings">Scriptopia Events Participated In</Text>
          <Box className="events">
            {events?.map((event) => (
              <Box className="event" key={event?._id}>
                <Text fontWeight="500">{event?.name}</Text>
                <Text mb="15px">ID: {event?._id}</Text>
                <Text className="stopOverflow">{event?.desc}</Text>
              </Box>
            ))}
          </Box>

          <Text className="headings">Certificates</Text>
          <Box className="events">
            {certifications?.map((certificate) => (
              <Box className="event" key={certificate?._id}>
                <Text fontWeight="500">{certificate?.certificateName}</Text>
                <Text fontSize="13px">
                  Status:{" "}
                  {certificate?.status.slice(0, 1).toUpperCase() +
                    certificate?.status.slice(1)}
                </Text>
                <Text mb="15px" fontSize="13px">
                  ID: {certificate?._id}
                </Text>

                <Text fontSize="14px">Issued By {certificate?.issuingOrg}</Text>
                <Text fontSize="14px">
                  Issued On{" "}
                  {certificate?.issueMonth.slice(0, 1).toUpperCase() +
                    certificate?.issueMonth.slice(1)}{" "}
                  {certificate?.issueYear}
                </Text>
              </Box>
            ))}
          </Box>
        </Flex>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Profile;
