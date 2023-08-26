import React, { useEffect, useState, useRef } from "react";
import "./Profile.css";
import {
  Box,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import Navbar from "../../components/student/Navbar";
import Chart from "chart.js/auto";
import Loader from "../../components/Loader";

const Profile = () => {
  !Cookies.get("token") ? (window.location.href = "/auth") : null;
  const [isLoading, setIsLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [level, setLevel] = React.useState({});
  const [data, setData] = React.useState({});
  const houseRef = useRef();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        data.lastOnline = new Date(data.lastOnline).toLocaleString();
        setLevel(calculateLevelInfo(data.XP));
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (houseRef.current) {
      renderChart();
    }
  }, [isLoading]);

  const renderChart = () => {
    const houseContribution = houseRef.current.getContext("2d");
    new Chart(houseContribution, {
      type: "doughnut",
      data: {
        labels: ["Red", "Blue"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19],
            borderWidth: 1,
          },
        ],
      },
    });
  };

  function calculateLevelInfo(xp) {
    // Define the XP breakpoints for levels
    const breakpoints = [
      0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800,
      9100, 10500, 12000, 13600, 15300, 17100, 19000,
    ];

    // Check if XP is negative or zero (invalid case)
    if (xp <= 0) {
      return {
        level1: 1,
        currentXP: 0,
        levelMaxXP: breakpoints[0],
      };
    }

    // Find the corresponding level based on the XP
    let level1;
    for (level1 = 1; level1 < breakpoints.length; level1++) {
      if (xp < breakpoints[level1]) {
        break;
      }
    }

    const currentXP = xp - breakpoints[level1 - 1];
    const levelMaxXP = breakpoints[level1] - breakpoints[level1 - 1];

    const percentage = (currentXP / levelMaxXP) * 100;
    setProgress(Math.min(percentage, 100));

    return {
      level1: level1,
      currentXP: currentXP,
      levelMaxXP: levelMaxXP,
    };
  }

  const lang = {
    py: "Python",
    js: "JavaScript",
    java: "Java",
    c: "C",
    cpp: "C++",
  };

  if (isLoading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Box className="Profile">
          <Box className="firstHalve">
            <Box className="left">
              <Box className="main-profile">
                <Box className="image-wrapper">
                  <Box
                    className="img"
                    style={{
                      background: `url(${data.profilePicture}) no-repeat center center/cover`,
                    }}
                  ></Box>
                </Box>
                <Box className="info">
                  <h4>{data.fname + " " + data.lname}</h4>
                  <p>{data.mid}</p>
                </Box>

                <Box className="stats">
                  <Box className="stat-group">
                    <Heading>17</Heading>
                    <Text>XP Points</Text>
                  </Box>
                  <Box className="stat-group">
                    <Heading>17</Heading>
                    <Text>Monthly Rank</Text>
                  </Box>
                  <Box className="stat-group">
                    <Heading>17</Heading>
                    <Text>Weekly Rank</Text>
                  </Box>
                </Box>
              </Box>
              <Box className="links">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <i className="fa-solid fa-envelopes"></i>
                  </InputLeftElement>
                  <Input type="email" placeholder="Email ID" />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <i className="fa-brands fa-linkedin"></i>
                  </InputLeftElement>
                  <Input type="url" placeholder="LinkedIn Profile URL" />
                </InputGroup>

                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <i className="fa-brands fa-github"></i>
                  </InputLeftElement>
                  <Input type="url" placeholder="Github Profile URL" />
                </InputGroup>

                <Button className="submit">Save</Button>
              </Box>
            </Box>

            <Box className="middle">
              <Box className="house">
                <Heading>Your House</Heading>
                <Text>Vibhuti House</Text>
                <Text>Your Contribution: 250 HP</Text>
                <Text>Total HP: 1200 HP</Text>
                <canvas id="houseContribution" ref={houseRef}></canvas>
              </Box>
            </Box>
          </Box>

          <Box className="secondHalve">
            <Box className="right">
              <Box className="certification">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Certification Name</Th>
                      <Th>Obtained On</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>inches</Td>
                      <Td>millimetres (mm)</Td>
                      <Td isNumeric>25.4</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>feet</Td>
                      <Td>centimetres (cm)</Td>
                      <Td isNumeric>30.48</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                    <Tr>
                      <Td>yards</Td>
                      <Td>metres (m)</Td>
                      <Td isNumeric>0.91444</Td>
                    </Tr>
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>To convert</Th>
                      <Th>into</Th>
                      <Th isNumeric>multiply by</Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
};

export default Profile;
