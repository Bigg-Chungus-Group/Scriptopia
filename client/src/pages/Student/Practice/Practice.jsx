import React, { useEffect } from "react";
import "./Practice.css";
import {
  Box,
  Button,
  Link,
  Menu,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import Navbar from "../../../components/student/Navbar";

const Practice = () => {
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/practice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((resp) => {
        setData(resp.problems);
      })
      .catch((err) => {
        window.location.href = "/auth";
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
      <Navbar />
      <Box className="Practice">
        <Box className="main">
          <Box className="top">
            <Text>Practice</Text>
            <Menu>
              
            </Menu>
          </Box>
          <div className="table" overflowY="scroll" overflowX="scroll">
            <Table variant="unstyled" className="table_main">
              {data.slice(0, 9).map((item) => {
                return (
                  <Tbody>
                    <Tr>
                      <Td>{item.codeTitle}</Td>
                      <Td className={`${item.difficultyLevel}`}>{item.difficultyLevel}</Td>
                      <Td>{language[item.language]}</Td>
                      <Td>
                        <Link href={`/problem/${item._id}`} className="viewLink">View</Link>
                      </Td>
                    </Tr>
                  </Tbody>
                );
              })}
            </Table>
            <Button>View More + </Button>
          </div>
        </Box>
        <Box className="left">
          <Box className="top"></Box>
          <Box className="bottom"></Box>
        </Box>
      </Box>
    </>
  );
};

export default Practice;
