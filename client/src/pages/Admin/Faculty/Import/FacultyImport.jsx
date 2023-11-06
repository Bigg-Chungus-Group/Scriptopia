import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../../../../components/admin/Navbar";
import Papa from "papaparse";
import Breadcrumb from "../../../../components/Breadcrumb";
import { useAuthCheck } from "../../../../hooks/useAuthCheck";
import "./FacultyImport.css";
import FacultyAdd from "./FacultyAdd";

const FacultyImport = () => {
  useAuthCheck("A");

  const [tableData, setTableData] = useState([]);
  const [adding, setAdding] = useState(false);
  const [addIndividual, setAddIndividual] = useState(false);
  const [houses, setHouses] = useState([]);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setTableData(result.data);
      },
    });
  };

  const handleModal = (value) => {
    setAddIndividual(value);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/houses`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setHouses(data);
      });
  }, []);

  const startImport = () => {
    setAdding(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/import`, {
      method: "POST",
      credentials: "include",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableData }),
    }).then((res) => {
      console.error(res);
      setAdding(false);
      if (res.status === 200) {
        toast({
          title: "Faculty Imported",
          description: "Staff has been successfully imported",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (res.status === 409) {
        toast({
          title: "Error",
          description: "Moodle ID already exists",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error in importing faculty",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      <Breadcrumb
        title="Add Faculty"
        links={[
          { href: "/admin", name: "Admin" },
          { href: "/admin/faculty", name: "Faculty" },
          { href: "#", name: "Add" },
        ]}
      />
      <Box className="FacultyImport">
        <Box className="main">
          <Box className="btn">
            <Button
              colorScheme="blue"
              onClick={() => {
                setAddIndividual(true);
              }}
            >
              Add Individual
            </Button>
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload .CSV
            </label>
          </Box>
          <Alert status="warning">
            <AlertIcon className="hide" />

            <AlertDescription>
              Please Upload a .CSV file with the following columns in the same
              order as shown below. Please make sure that the first row of the
              .CSV file DOES NOT contain the column names. No Blank Rows are to
              be present in the .CSV file.
            </AlertDescription>
          </Alert>

          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />

          <Box className="table">
            <Table variant="striped">
              <Thead>
                <Tr
                  position="sticky"
                  top={0}
                  zIndex="sticky"
                  backgroundColor="#F7F6FA"
                >
                  <Th>Moodle ID</Th>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Gender</Th>
                  <Th>Email</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData.map((row, index) => (
                  <Tr key={row.mid}>
                    {row.map((cell, index) => (
                      <Td key={index}>{cell}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Box className="footer">
            <Button
              colorScheme="green"
              onClick={startImport}
              isLoading={adding}
            >
              Import
            </Button>
          </Box>
        </Box>
      </Box>

      {addIndividual ? <FacultyAdd setModal={handleModal} h={houses} /> : <></>}
    </>
  );
};

export default FacultyImport;
