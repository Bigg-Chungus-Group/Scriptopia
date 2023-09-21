import React, { useEffect, useRef } from "react";
import "./Profile.css";
import {
  Box,
  Heading,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";
import Chart from "chart.js/auto";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Profile = () => {
  useAuthCheck("S");

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState({});
  const houseRef = useRef();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/profile`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((data) => {
        data.lastOnline = new Date(data.lastOnline).toLocaleString();
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
    const hcChart = new Chart(houseContribution, {
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

    return () => {
      if (hcChart) {
        hcChart.destroy();
      }
    };
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
