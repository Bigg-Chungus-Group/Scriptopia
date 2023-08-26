import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  Box,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CircularProgress,
  CircularProgressLabel,
  Center,
  Divider,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  PopoverCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  PopoverArrow,
  PopoverBody,
  useDisclosure,
} from "@chakra-ui/react";
import Navbar from "../../components/student/Navbar";
import Chart from "chart.js/auto";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

import IntroModal from "./IntroModal";

const Home = () => {
  !Cookies.get("token") ? (window.location.href = "/auth") : null;
  const [user, setUser] = useState();
  const [house, setHouse] = useState();
  const [assignments, setAssignments] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(false);

  const jwt = Cookies.get("token");
  const decoded = jwtDecode(jwt);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/dashboard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHouse(data.userHouse);
        setAssignments(data.assignments);
        setProblems(data.problems);
        data.user.firstTime ? setFirstTime(true) : setFirstTime(false);

        const dateCounts = countDates(data.activity);
        const reversedDates = Object.keys(dateCounts).slice(0, 7).reverse();
        const reversedCounts = Object.values(dateCounts).slice(0, 7).reverse();

        const ctx = document.getElementById("activityChart").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: reversedDates, // Get labels from dateCounts object
            datasets: [
              {
                label: "Activity",
                data: reversedCounts, // Use values from dateCounts object
                tension: 0.4,
                borderColor: "#3e95cd",
                fill: false,
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

            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  stepSize: 1, // Set the step size to 1 to show whole numbers
                },
              },
            },
          },
        });
      });

    setLoading(false);
  }, []);

  const language = {
    js: "JavaScript",
    java: "Java",
    python: "Python",
    cpp: "C++",
    c: "C",
    go: "GoLang",
    cs: "C#",
  };

  const countDates = (activity) => {
    const dateCounts = {};

    activity.forEach((item) => {
      const { date } = item;
      if (dateCounts[date]) {
        dateCounts[date] += 1;
      } else {
        dateCounts[date] = 1;
      }
    });

    return dateCounts;
  };

  function getFormattedDate() {
    const now = new Date();
    const options = { year: "numeric", month: "long" };

    const day = now.getDate();
    const suffix = getDaySuffix(day);

    const formattedDate = now.toLocaleDateString(undefined, options);

    return `${day}${suffix} ${formattedDate}`;
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const formattedToday = getFormattedDate();

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="Home">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Box className="title">
            <Heading>Welcome, {decoded.fname}</Heading>
            <Popover>
              <PopoverTrigger>
                <i
                  className="fa-duotone fa-seal-exclamation"
                  style={{
                    "--fa-primary-color": "#ff0000",
                    "--fa-secondary-color": " #ff0000",
                  }}
                ></i>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    <Text marginBottom="10px">
                      You have pending assignments
                    </Text>
                    <Link to="/assignments" className="link_assignments_home">
                      Complete Now
                    </Link>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
          <Box className="main">
            <Box className="left">
              {" "}
              <Text>{formattedToday}</Text>
              <Box className="stats">
                <Box className="totalXP">
                  <Stat>
                    <StatLabel>Total XP</StatLabel>
                    <StatNumber>{user ? `${user.XP} XP` : "N/A"}</StatNumber>
                  </Stat>
                </Box>
                <Box className="rank-alltime">
                  <Stat>
                    <StatLabel>Rank All Time</StatLabel>
                    <StatNumber>
                      {user ? `#${user.rank.alltime}` : ""}
                    </StatNumber>
                  </Stat>
                </Box>
                <Box className="rank-monthly">
                  <Stat>
                    <StatLabel>Rank Monthly</StatLabel>
                    <StatNumber>
                      {user ? `#${user.rank.monthly}` : ""}
                    </StatNumber>
                  </Stat>
                </Box>
              </Box>
              <Box className="represent">
                <Heading size="md" marginBottom="20px">
                  Activity Graph
                </Heading>
                <Box className="canvas">
                  <canvas id="activityChart"></canvas>
                </Box>
              </Box>
            </Box>
            <Box className="right">
              <Card className="house">
                <CardHeader>
                  <Heading size="md">Your House</Heading>
                </CardHeader>
                <CardBody>
                  <Box className="info">
                    <Heading>{house ? house.house.name : "No"} House</Heading>
                    <Center>
                      <CircularProgress value={80} size="150px" />
                    </Center>
                    <Box className="ranking">
                      <Box className="group">
                        <i className="fa-regular fa-star"></i>
                        <Text>{house ? house.house.points : "N/A"}</Text>
                      </Box>
                      <Box className="group">
                        <i className="fa-regular fa-trophy"></i>
                        <Text>{house ? house.house.ranking : "N/A"}</Text>
                      </Box>
                      <Box className="group">
                        <Text>
                          Your Contribution:{" "}
                          {house ? house.contribution : "N/A"}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        </Box>

        {firstTime ? <IntroModal /> : null}
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Home;
