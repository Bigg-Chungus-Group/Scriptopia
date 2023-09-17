import React, { useEffect, useState } from "react";
import "./Faculty.css";
import {
  Box,
  FormLabel,
  Input,
  InputGroup,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Navbar from "../../../components/admin/Navbar";
import Breadcrumb from "../../../components/Breadcrumb";
import Loader from "../../../components/Loader";

const Faculty = () => {
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaculty, seFilteredFaculty] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty`, {
      // ! CHANGE TO FACULTY
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setFaculty(data.faculty);
      });
  }, [searchQuery]);

  useEffect(() => {
    const filtered = faculty.filter((faculty) =>
      Object.values(faculty).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    seFilteredFaculty(filtered);
  }, [searchQuery, faculty]);

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Breadcrumb
          title="Faculty"
          links={[
            { href: "/admin", name: "Admin" },
            { href: "/admin/faculty", name: "Faculty" },
          ]}
          relatedLinks={[{ href: "/admin/faculty/add", name: "Add Faculty" }]}
        />
        <Box className="AdminStudents">
          <Box className="filters">
            <Box className="filters">
              <Box className="ipgroup">
                <FormLabel>Search</FormLabel>
                <Input
                  placeholder="Search By Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </Box>
          </Box>

          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr
                  position="sticky"
                  top="0px"
                  className="tabletop"
                  zIndex="sticky"
                  backgroundColor="#F7F6FA"
                >
                  <Th>Moodle ID</Th>
                  <Th>Name</Th>
                  <Th>Branch</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFaculty.map((student) => (
                  <Tr key={student.mid}>
                    <Td>{student.mid}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.branch}</Td>
                    <Td>
                      <Box className="actions">
                        <Box className="action">Edit</Box>
                        <Box className="action">Delete</Box>
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </>
    );
};

export default Faculty;
