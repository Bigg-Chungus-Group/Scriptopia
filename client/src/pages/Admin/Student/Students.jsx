import React, { useEffect, useState } from "react";
import "./Students.css";
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

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedHouse, setSelectedHouse] = useState("all");
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students`, {
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
        setStudents(data.students);
      });
  }, [searchQuery]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        (selectedYear === "all" || student.year === selectedYear) &&
        (selectedBranch === "all" || student.branch === selectedBranch) &&
        (selectedHouse === "all" || student.house === selectedHouse) &&
        Object.values(student).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students, selectedYear, selectedBranch, selectedHouse]);

  if (loading) return <Loader />;
  else
    return (
      <>
        <Navbar />
        <Breadcrumb
          title="Students"
          links={[
            { href: "/admin", name: "Admin" },
            { href: "/students", name: "Students" },
          ]}
          relatedLinks={[
            { href: "/admin/students/add", name: "Add Students" },
            { href: "/admin/students/import", name: "Import Students" },
          ]}
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

              <Box className="ipgroup">
                <FormLabel>Select Year</FormLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="fe">First Year</option>
                  <option value="se">Second Year</option>
                  <option value="te">Third Year</option>
                  <option value="be">Fourth Year</option>
                </Select>
              </Box>

              <Box className="ipgroup">
                <FormLabel>Select Branch</FormLabel>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="IT">Information Technology</option>
                  <option value="COMP">Computer Engineering</option>
                  <option value="EXTC">
                    Electronics and Telecommunication
                  </option>
                  <option value="AIML">AI and ML</option>
                </Select>
              </Box>

              <Box className="ipgroup">
                <FormLabel>Select House</FormLabel>
                <Select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Red">Red</option>
                  <option value="Green">Green</option>
                  <option value="Blue">Blue</option>
                  <option value="Yellow">Yellow</option>
                </Select>
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
                  <Th>Year</Th>
                  <Th>Branch</Th>
                  <Th>House</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.map((student) => (
                  <Tr key={student.mid}>
                    <Td>{student.mid}</Td>
                    <Td>{student.name}</Td>
                    <Td>{student.year}</Td>
                    <Td>{student.branch}</Td>
                    <Td>{student.house}</Td>
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

export default Students;
