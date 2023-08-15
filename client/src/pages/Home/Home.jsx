import React, { useEffect } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import {
  Divider,
  Box,
  Text,
  Table,
  Thead,
  Tr,
  Td,
  Link,
  CircularProgress,
  Heading,
  Progress,
  Image,
} from "@chakra-ui/react";

const Home = () => {
  !Cookies.get("token") ? (window.location.href = "/auth") : null;
  const [data, setData] = React.useState({ assignments: [], problems: [] });

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
        setData(data);
        console.log(data);
      });
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

  return (
    <>
      {" "}
      <Navbar />
      <Box className="Home">
        <Box className="left">
          <Box className="assign" position="relative">
            <Box className="top">
              <Text className="title" paddingLeft={5}>
                Get Your Assignments Completed!
              </Text>
              <Link className="vm" href="/assignments">
                View All
              </Link>
            </Box>

            <Table fontSize={14} variant="unstyled" size="sm" margin="10px">
              {data.assignments.slice(0, 4).map((assignment) => {
                return (
                  <>
                    <Tr>
                      <Td>{assignment.title}</Td>
                      <Td color="red">Due by {assignment.deadline}</Td>
                      <Td>
                        <a href={`/assignment/${assignment._id}`}>View</a>
                      </Td>
                    </Tr>
                  </>
                );
              })}
            </Table>
          </Box>
          <Box className="practice">
            <Box className="top">
              <Text paddingLeft={5} className="title">
                Practice
              </Text>
              <Link className="vm" href="/practice">
                View All
              </Link>
            </Box>

            <Table variant="unstyled" size="sm" margin="10px">
              {data.problems.slice(0, 4).map((practice) => {
                return (
                  <>
                    <Tr>
                      <Td>{practice.codeTitle}</Td>
                      <Td>{language[practice.language]}</Td>
                      <Td>{practice.difficultyLevel}</Td>
                      <Td>
                        <a href={`/practice/${practice._id}`}>View</a>
                      </Td>
                    </Tr>
                  </>
                );
              })}
            </Table>
          </Box>
        </Box>
        <Box className="right house">
          <Box className="top">
            <Text paddingLeft={5} className="title">
              Your House
            </Text>
          </Box>
          <Box className="info-wrapper">
            <Image
              src="https://i.imgur.com/WZkxgX2.jpeg"
              boxSize={200}
              borderRadius="50%"
            />

            <Box className="info">
              <Heading>Vibhuti House</Heading>
              <Text>Points: 60</Text>
              <Text>Rank: 1</Text>
              <Text>Your Contribution: +60 HP</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
