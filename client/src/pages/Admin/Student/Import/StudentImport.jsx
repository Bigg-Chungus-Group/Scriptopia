import React, { useState } from "react";
import "./StudentImport.css";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import {
  Box,
  Button,
  Heading,
  Input,
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

const StudentImport = () => {
  useAuthCheck("A");

  const [tableData, setTableData] = useState([]);
  const [adding, setAdding] = useState(false);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setTableData(result.data);
      },
    });
  };

  const startImport = () => {
    setAdding(true);
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/students/import`, {
      method: "POST",
      cors: "no-cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableData }),
    }).then((res) => {
      setAdding(false);
      if (res.status === 200) {
        toast({
          title: "Students Imported",
          description: "Students have been successfully imported",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Error in importing students",
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
        title="Import Students"
        links={[
          { href: "/admin", name: "Admin" },
          { href: "/admin/students", name: "Students" },
          { href: "#", name: "Import" },
        ]}
      />
      <Box className="StudentImport">
        <Box className="main">
          <label htmlFor="file-upload" className="custom-file-upload">
            Upload .CSV
          </label>
          <Alert status="warning">
            <AlertIcon />

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
                  <Th>Student ID</Th>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Gender</Th>
                  <Th>AY</Th>
                  <Th>Branch</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tableData.map((row, index) => (
                  <Tr key={index}>
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
    </>
  );
};

export default StudentImport;
