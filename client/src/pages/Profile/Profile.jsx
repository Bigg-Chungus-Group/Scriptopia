import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";

import StudentNav from "../../components/student/Navbar";
import AdminNav from "../../components/admin/Navbar";
import FacultyNav from "../../components/faculty/Navbar";
import GuestNav from "../../components/guest/Navbar";
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
} from "@chakra-ui/react";

import Chart from "chart.js/auto";
import Loader from "../../components/Loader";

const Profile = () => {
  const [profile, setProfile] = useState([]);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);
  

  const [user, setUser] = useState();
  const [houses, setHouses] = useState();
  const [userHouse, setUserHouse] = useState();
  const [certifications, setCertifications] = useState();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [hp, setHp] = useState(0);
  const [firstTime, setFirstTime] = useState(false);

  function calculateTotalPoints(data) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); // Get the current year

    let totalInternalPoints = 0;
    let totalExternalPoints = 0;
    let totalEventsPoints = 0;

    if (data && data.points && data.points[currentYear.toString()]) {
      const monthlyPoints = data.points[currentYear.toString()];
      for (const month in monthlyPoints) {
        if (monthlyPoints.hasOwnProperty(month)) {
          // Separate internal, external, and events points
          const { internal, external, events } = monthlyPoints[month];

          // Add them to their respective totals
          totalInternalPoints += internal;
          totalExternalPoints += external;
          totalEventsPoints += events;
        }
      }
    }

    return {
      totalInternal: totalInternalPoints,
      totalExternal: totalExternalPoints,
      totalEvents: totalEventsPoints,
    };
  }

  useEffect(() => {
    const id = window.location.href.split("/").slice(-1)[0];
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/dashboard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHouses(data.allHouses);
        setUserHouse(data.userHouse);
        setCertifications(data.certifications);
        setFirstTime(data.user.firstTime);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Error fetching dashboard data",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, []);

  useEffect(() => {
    let cont;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    if (!loading) {
      const sepPoints = calculateTotalPoints(user.house);
      const totalPoints =
        sepPoints.totalInternal +
        sepPoints.totalExternal +
        sepPoints.totalEvents;

      const sephousePoints = calculateTotalPoints(userHouse);
      const housePoints =
        sephousePoints.totalInternal +
        sephousePoints.totalExternal +
        sephousePoints.totalEvents;

      cont = document.getElementById("contribution");
      const contrChart = new Chart(cont, {
        type: "doughnut",
        data: {
          labels: [
            "Your House",
            "Internal Certification Points",
            "External Certification Points",
            "Events Certification Points",
          ],
          datasets: [
            {
              label: "Points",
              data: [
                housePoints - totalPoints,
                sepPoints.totalInternal,
                sepPoints.totalExternal,
                sepPoints.totalEvents,
              ],
              backgroundColor: ["#3e95cd", "#ffb6c1", "#9370db", "#87ceeb"],
              borderColor: ["#3e95cd", "#ffb6c1", "#9370db", "#87ceeb"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });

      return () => {
        if (contrChart) {
          contrChart.destroy();
        }
      };
    }

    return () => {
      if (cont) {
        contrChart.destroy();
      }
    };
  }, [loading, userHouse, user]);

  useEffect(() => {
    const token = Cookies.get("token");
    let jwt;
    if (token) {
      jwt = jwtDecode(token);
      setRole(jwt.role);
    }
  }, []);

  if (!loading) {
    return (
      <>
        {role === "S" ? (
          <StudentNav />
        ) : role === "A" ? (
          <AdminNav />
        ) : role === "F" ? (
          <FacultyNav />
        ) : (
          <GuestNav />
        )}

        <Flex p="30px 70px" gap="20px">
          <Box width="30%">
            <Flex
              p="20px"
              direction="column"
              gap="20px"
              align="center"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              borderRadius="15px"
            >
              <Avatar size="2xl" />
              <Text>Anurag Sawant </Text>
              <Text>22204016</Text>

              <Flex gap="20px">
                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>26</Text>
                    <Text fontSize="13px">Internal Certificates</Text>
                  </Flex>
                </Box>

                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>26</Text>
                    <Text fontSize="13px">External Certificates</Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                <Flex direction="column" align="center" justify="center">
                  <Text>26</Text>
                  <Text fontSize="13px">Events Certificates</Text>
                </Flex>
              </Box>
            </Flex>

            <Flex
              direction="column"
              gap="15px"
              mt="20px"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              borderRadius="15px"
              p="20px"
            >
              <Flex
                gap="10px"
                direction="row"
                align="center"
                border="1px solid lightgray"
                padding="8px"
                borderRadius="5px"
              >
                <i className="fa-solid fa-envelopes"></i>
                <Link>anuragsawant@duck.com</Link>
              </Flex>
              <Flex
                gap="10px"
                direction="row"
                align="center"
                border="1px solid lightgray"
                padding="8px"
                borderRadius="5px"
              >
                <i className="fa-brands fa-linkedin"></i>
                <Link>anuragsawant@duck.com</Link>
              </Flex>
              <Flex
                gap="10px"
                direction="row"
                align="center"
                border="1px solid lightgray"
                padding="8px"
                borderRadius="5px"
              >
                <i className="fa-brands fa-github"></i>
                <Link>anuragsawant@duck.com</Link>
              </Flex>
            </Flex>
          </Box>

          <Box
            className="pointAnalysis"
            width="30%"
            height="48vh"
            minHeight="fit-content"
            p="20px"
            borderRadius="15px"
            boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
          >
            <Heading fontSize="17px" mb="50px">
              House Contribution
            </Heading>
            <Flex
              align="center"
              justify="center"
              height="60%"
              gap="20px"
              direction="column"
            >
              <canvas id="contribution" width="10px" height="10px"></canvas>
            </Flex>
          </Box>
        </Flex>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Profile;
