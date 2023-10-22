import React, { useState, useEffect } from "react";
import "./Home.css";
import {
  Box,
  Heading,
  Text,
  Tabs,
  Td,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Select,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
} from "@chakra-ui/react";
import Navbar from "../../../components/faculty/Navbar";
import Chart from "chart.js/auto";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Home = () => {
  const decoded = useAuthCheck("F");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [houses, setHouses] = useState();
  const [userHouse, setUserHouse] = useState();
  const [certifications, setCertifications] = useState();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [hp, setHp] = useState(0);
  const [permsArray, setPermsArray] = useState([]);

  const toast = useToast();

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/dashboard`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mid: decoded.mid }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setHouses(data.allHouses);
        setUserHouse(data.userHouse);
        setCertifications(data.certifications);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERR");
        console.error(err);
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
    let hcl;
    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    if (!loading) {
      let house1, house2, house3, house4;
      if (selectedMonth === "all") {
        house1 = calculateTotalPoints(houses[0]);
        house2 = calculateTotalPoints(houses[1]);
        house3 = calculateTotalPoints(houses[2]);
        house4 = calculateTotalPoints(houses[3]);

        house1 =
          house1.totalInternal + house1.totalExternal + house1.totalEvents;
        house2 =
          house2.totalInternal + house2.totalExternal + house2.totalEvents;
        house3 =
          house3.totalInternal + house3.totalExternal + house3.totalEvents;
        house4 =
          house4.totalInternal + house4.totalExternal + house4.totalEvents;
      } else {
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        currentYear = currentYear.toString();

        house1 = houses[0].points[2023][selectedMonth];
        house2 = houses[1].points[2023][selectedMonth];
        house3 = houses[2].points[2023][selectedMonth];
        house4 = houses[3].points[2023][selectedMonth];

        house1 = house1.internal + house1.external + house1.events;
        house2 = house2.internal + house2.external + house2.events;
        house3 = house3.internal + house3.external + house3.events;
        house4 = house4.internal + house4.external + house4.events;
      }

      const houseLeaderboard = document.getElementById("houseLeaderboard");
      hcl = new Chart(houseLeaderboard, {
        type: "bar",
        data: {
          labels: [
            houses[0].name,
            houses[1].name,
            houses[2].name,
            houses[3].name,
          ],
          datasets: [
            {
              label: "Points",
              data: [house1, house2, house3, house4],
              backgroundColor: [
                houses[0].color,
                houses[1].color,
                houses[2].color,
                houses[3].color,
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: "#f2f2f2",
                display: false
              },
              ticks: {
                display: false,
                major: false,
              },
              border: {
                display: false,
              },
            },
            y: {
              grid: {
                color: "#f2f2f2",
                display: false
              },
            },
          },
        },
      });
    }

    return () => {
      if (hcl) {
        hcl.destroy();
      }
    };
  }, [loading, selectedMonth]);

  useEffect(() => {
    function hexToRgba(hex, opacity) {
      // Remove the hash character (#) if present
      hex = hex.replace(/^#/, "");

      // Parse the hex color into RGB components
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      // Create and return the RGBA color
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    const currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    currentYear = currentYear.toString();

    let myHouseChart;
    let myHouse;

    if (!loading && userHouse) {
      const jan =
        userHouse.points[currentYear.toString()]["january"].internal +
        userHouse.points[currentYear.toString()]["january"].external +
        userHouse.points[currentYear.toString()]["january"].events;
      const feb =
        userHouse.points[currentYear.toString()]["february"].internal +
        userHouse.points[currentYear.toString()]["february"].external +
        userHouse.points[currentYear.toString()]["february"].events;
      const mar =
        userHouse.points[currentYear.toString()]["march"].internal +
        userHouse.points[currentYear.toString()]["march"].external +
        userHouse.points[currentYear.toString()]["march"].events;
      const apr =
        userHouse.points[currentYear.toString()]["april"].internal +
        userHouse.points[currentYear.toString()]["april"].external +
        userHouse.points[currentYear.toString()]["april"].events;
      const may =
        userHouse.points[currentYear.toString()]["may"].internal +
        userHouse.points[currentYear.toString()]["may"].external +
        userHouse.points[currentYear.toString()]["may"].events;
      const jun =
        userHouse.points[currentYear.toString()]["june"].internal +
        userHouse.points[currentYear.toString()]["june"].external +
        userHouse.points[currentYear.toString()]["june"].events;
      const jul =
        userHouse.points[currentYear.toString()]["july"].internal +
        userHouse.points[currentYear.toString()]["july"].external +
        userHouse.points[currentYear.toString()]["july"].events;
      const aug =
        userHouse.points[currentYear.toString()]["august"].internal +
        userHouse.points[currentYear.toString()]["august"].external +
        userHouse.points[currentYear.toString()]["august"].events;
      const sep =
        userHouse.points[currentYear.toString()]["september"].internal +
        userHouse.points[currentYear.toString()]["september"].external +
        userHouse.points[currentYear.toString()]["september"].events;
      const oct =
        userHouse.points[currentYear.toString()]["october"].internal +
        userHouse.points[currentYear.toString()]["october"].external +
        userHouse.points[currentYear.toString()]["october"].events;
      const nov =
        userHouse.points[currentYear.toString()]["november"].internal +
        userHouse.points[currentYear.toString()]["november"].external +
        userHouse.points[currentYear.toString()]["november"].events;
      const dec =
        userHouse.points[currentYear.toString()]["december"].internal +
        userHouse.points[currentYear.toString()]["december"].external +
        userHouse.points[currentYear.toString()]["december"].events;

      myHouse = document.getElementById("myHouse");
      myHouseChart = new Chart(myHouse, {
        type: "line",
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Points",
              data: [
                jan,
                feb,
                mar,
                apr,
                may,
                jun,
                jul,
                aug,
                sep,
                oct,
                nov,
                dec,
              ],
              tension: 0.3,
              borderColor: houses[0].color,
              fill: true, // Enable the fill area
              backgroundColor: hexToRgba(houses[1].color, 0.25), // Fill color
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
              grid: { color: "#f2f2f2", display: false },
            },
            y: {
              grid: { color: "#f2f2f2", display: false },
              ticks: {
                display: false, // Set the step size to 1 to show whole numbers
              },
              border: {
                display: false,
              },
            },
          },
        },
      });
    }

    return () => {
      if (myHouseChart) {
        myHouseChart.destroy();
      }
    };
  }, [loading, userHouse]);

  useEffect(() => {
    if (!loading) {
      setHp(calculateTotalPoints());
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && decoded.perms) {
      decoded.perms.forEach((perm) => {
        switch (perm) {
          case "VSP":
            setPermsArray((prev) => [...prev, "View Student Profile"]);
            break;
          case "VFI":
            setPermsArray((prev) => [...prev, "View Faculty Profile"]);
            break;
          case "MHI":
            setPermsArray((prev) => [...prev, "Manage House Events"]);
            break;
          case "GRR":
            setPermsArray((prev) => [...prev, "Generate Reports"]);
            break;
          case "HC0":
            setPermsArray((prev) => [...prev, "Cordinator - House One"]);
            break;
          case "HC1":
            setPermsArray((prev) => [...prev, "Cordinator - House Two"]);
            break;
          case "HC2":
            setPermsArray((prev) => [...prev, "Cordinator - House Three"]);
            break;
          case "HC3":
            setPermsArray((prev) => [...prev, "Cordinator - House Four"]);
            break;
          case "RSP":
            setPermsArray((prev) => [...prev, "Reset Student Password"]);
            break;
          case "AES":
            setPermsArray((prev) => [...prev, "Add Edit Student"]);
            break;

          default:
            break;
        }
      });
    }
  }, [loading]);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="StudentDashboard">
          <Box className="left">
            <Box className="houseLeaderboard">
              <Flex justifyContent="space-between">
                <Box>
                  <Heading fontSize="17px">House Leaderboard</Heading>
                  <Text fontSize="12px">
                    See your house's rank in the points race.
                  </Text>
                </Box>
                {/* Step 4: Add onChange event to select */}
                <Select
                  width="150px"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="all">All</option>
                  <option value="january">January</option>
                  <option value="february">February</option>
                  <option value="march">March</option>
                  <option value="april">April</option>
                  <option value="may">May</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                  <option value="september">September</option>
                  <option value="october">October</option>
                  <option value="november">November</option>
                  <option value="december">December</option>
                </Select>
              </Flex>
              <canvas id="houseLeaderboard"></canvas>
            </Box>
            <Box className="certifications">
              <Tabs>
                <TabList>
                  <Tab>Internal</Tab>
                  <Tab>Events</Tab>
                  <Tab>External</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Certification Details</Th>
                          <Th className="hideOnPhone">Points</Th>
                          <Th className="hideOnPhone">Submitted On</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {certifications
                          .slice(0, 3)
                          .filter((cert) => cert.certificateType === "internal")
                          .map((cert) => (
                            <Tr key={cert._id}>
                              <Td>
                                <Text>{cert?.certificateName}</Text>
                                <Text fontSize="12px">{cert?.issuingOrg}</Text>
                              </Td>
                              <Td className="hideOnPhone">{cert.xp || "0"}</Td>
                              <Td className="hideOnPhone">
                                {cert.submissionDate || null}
                              </Td>
                              <Td>{cert.status}</Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  <TabPanel>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Certification Details</Th>
                          <Th>Points</Th>
                          <Th>Submitted On</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {certifications
                          .slice(0, 3)
                          .filter((cert) => cert.certificateType === "external")
                          .map((cert) => (
                            <Tr key={cert._id}>
                              <Td>
                                <Text>{cert.certificateName}</Text>
                                <Text fontSize="12px">{cert.issuingOrg}</Text>
                              </Td>
                              <Td>{cert.points || "0"}</Td>
                              <Td>{cert.submissionDate || null}</Td>
                              <Td>{cert.status}</Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                  <TabPanel>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Certification Details</Th>
                          <Th>Points</Th>
                          <Th>Submitted On</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {certifications
                          .slice(0, 3)
                          .filter((cert) => cert.certificateType === "event")
                          .map((cert) => (
                            <Tr key={cert._id}>
                              <Td>
                                <Text>{cert.certificateName}</Text>
                                <Text fontSize="12px">{cert.issuingOrg}</Text>
                              </Td>
                              <Td>{cert.points || "0"}</Td>
                              <Td>{cert.submissionDate || null}</Td>
                              <Td>{cert.status}</Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
          <Box className="right">
            <Box className="myHouse">
              <Flex justify="space-between">
                <Heading fontSize="17px">
                  {userHouse.name} House Leader-board
                </Heading>
              </Flex>

              <canvas id="myHouse"></canvas>
            </Box>
            <Box className="pointAnalysis">
              <Heading mb="10px" fontSize="17px">
                Your Permissions
              </Heading>

              {permsArray.map((perm, index) => {
                return <Text key={index}>{perm}</Text>;
              })}
            </Box>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Home;
