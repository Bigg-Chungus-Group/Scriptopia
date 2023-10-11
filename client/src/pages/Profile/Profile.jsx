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
  Table,
  Thead,
  Tr,
  Td,
  useToast,
  Tbody,
  InputLeftAddon,
} from "@chakra-ui/react";

import Chart from "chart.js/auto";
import Loader from "../../components/Loader";

const Profile = () => {
  const [privilege, setPrivilege] = useState(false);
  const [profile, setProfile] = useState([]);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const [user, setUser] = useState();
  const [houses, setHouses] = useState();
  const [userHouse, setUserHouse] = useState();
  const [certifications, setCertifications] = useState();
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [hp, setHp] = useState(0);
  const [firstTime, setFirstTime] = useState(false);

  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [mid, setMid] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    let jwt;
    try {
      if (token) {
        if (user) {
          jwt = jwtDecode(token);
          if (jwt?.mid === user?.mid) {
            setPrivilege(true);
            setMid(jwt?.mid);
          } else {
            setPrivilege(false);
          }
        }
      }
    } catch (error) {
      setPrivilege(false);
    }
  }, [loading, user]);

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

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${id}`, {
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
        setEmail(data.user.email);
        setLinkedin(data.user.linkedin);
        setGithub(data.user.github);
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

      myHouse = document.getElementById("graph");
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
              grid: { color: "#f2f2f2", display: true },
            },
            y: {
              grid: { color: "#f2f2f2", display: true },
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
  }, [loading]);

  const changeEmail = (e) => {
    setEmail(e.target.value);
    console.log("<ID");
    console.log(mid);

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (e.key === "Enter") {
      if (!validateEmail(email)) {
        toast({
          title: "Invalid Email",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Email Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const changeLinkedin = (e) => {
    setLinkedin(e.target.value);

    const isLinkedInURL = (url) => {
      const linkedInPattern =
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/i;
      return linkedInPattern.test(url);
    };

    if (e.key === "Enter") {
      if (!isLinkedInURL(e.target.value)) {
        toast({
          title: "Invalid Linkedin URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const url = new URL(e.target.value);
      } catch (_) {
        console.log(_);
        toast({
          title: "Invalid Github URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Linkedin Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const changeGithub = (e) => {
    setGithub(e.target.value);

    const isGitHubURL = (url) => {
      const githubPattern =
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+$/i;
      return githubPattern.test(url);
    };

    if (e.key === "Enter") {
      if (!isGitHubURL(e.target.value)) {
        toast({
          title: "Invalid URL",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${mid}/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, linkedin, github }),
      })
        .then((res) => {
          if (res.status === 200) {
            toast({
              title: "Github Updated Successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            e.target.blur();
          } else {
            toast({
              title: "Error",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

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

        <Flex p="10px 70px 0px" gap="20px">
          <Heading>{privilege}</Heading>
          {console.log(privilege)}
          <Box width="300vw">
            <Flex
              p="20px"
              direction="column"
              gap="20px"
              align="center"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              borderRadius="15px"
              width="100%"
            >
              <Avatar size="2xl" src={user.profilePicture} />
              <Text>
                {user?.fname} {user?.lname}
              </Text>
              <Text>{user?.mid}</Text>

              <Flex gap="20px">
                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>{user?.certificates?.internal}</Text>
                    <Text fontSize="13px">Internal Certificates</Text>
                  </Flex>
                </Box>

                <Box>
                  <Flex direction="column" align="center" justify="center">
                    <Text>{user?.certificates?.external}</Text>
                    <Text fontSize="13px">External Certificates</Text>
                  </Flex>
                </Box>
              </Flex>

              <Box>
                <Flex direction="column" align="center" justify="center">
                  <Text>{user?.certificates?.event}</Text>
                  <Text fontSize="13px">Events Certificates</Text>
                </Flex>
              </Box>
            </Flex>

            {privilege ? (
              <Flex
                direction="column"
                gap="15px"
                mt="20px"
                boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                borderRadius="15px"
                p="20px"
              >
                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-solid fa-envelopes"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    direction="row"
                    type="email"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.email}
                    onKeyUp={changeEmail}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-brands fa-linkedin"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    type="url"
                    direction="row"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.linkedin}
                    onKeyUp={changeLinkedin}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLeftAddon>
                    <i className="fa-brands fa-github"></i>
                  </InputLeftAddon>
                  <Input
                    gap="10px"
                    direction="row"
                    type="url"
                    align="center"
                    border="1px solid lightgray"
                    padding="8px"
                    borderRadius="5px"
                    defaultValue={user?.github}
                    onKeyUp={changeGithub}
                  />
                </InputGroup>
              </Flex>
            ) : (
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
                  <Link href={"mailto:" + user?.email} target="_blank">
                    {user?.email}
                  </Link>
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
                  <Link href={user?.linkedin} target="_blank">
                    {user?.linkedin}
                  </Link>
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
                  <Link target="_blank" href={user?.github}>
                    {user?.github}
                  </Link>
                </Flex>
              </Flex>
            )}
          </Box>

          <Flex direction="column" gap="20px">
            <Box height="fit-content" gap="20px">
              <Flex width="65vw" gap="20px">
                <Box
                  className="pointAnalysis"
                  height="41.5vh"
                  minHeight="fit-content"
                  p="20px"
                  borderRadius="15px"
                  boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                  width="50%"
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
                    <canvas
                      id="contribution"
                      width="10px"
                      height="10px"
                    ></canvas>
                  </Flex>
                </Box>

                <Box
                  className="pointAnalysis"
                  height="41.5vh"
                  minHeight="fit-content"
                  borderRadius="15px"
                  boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
                  width="50%"
                  p="0px 10px"
                  pb="30px"
                >
                  <Heading p="20px" pb="0" fontSize="17px" mb="50px">
                    Contribution Graph
                  </Heading>

                  <Flex
                    align="center"
                    justify="center"
                    height="70%"
                    gap="20px"
                    direction="column"
                  >
                    <canvas id="graph" width="10px" height="10px"></canvas>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            <Box
              className="pointAnalysis"
              width="100%"
              height="41.5vh"
              minHeight="fit-content"
              borderRadius="15px"
              boxShadow="0px 0px 10px 0px rgba(185, 100, 245, 0.1);"
              p="20px"
              overflowY="auto"
            >
              <Table>
                <Thead>
                  <Tr>
                    <Td>Sr. No</Td>
                    <Td>Certificate Name</Td>
                    <Td>Issuing Org.</Td>
                    <Td>Type</Td>
                    <Td>Issue Date</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {certifications.map((certification, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{certification?.certificateName}</Td>
                      <Td>{certification?.issuingOrg}</Td>
                      <Td>{certification?.certificateType}</Td>
                      <Td>
                        {certification?.issueMonth} {certification.issueYear}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        </Flex>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Profile;
