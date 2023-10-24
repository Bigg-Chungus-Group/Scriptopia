import React, { useEffect, useState } from "react";
import Navbar from "../../../components/admin/Navbar";
import "./Certificates.css";
import {
  Box,
  Heading,
  Table,
  Td,
  Tr,
  Th,
  Tbody,
  Thead,
  Button,
  useToast,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useAuthCheck } from "../../../hooks/useAuthCheck";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const decoded = useAuthCheck("A");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/certificates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(false);
        return res.json();
      })
      .then((data) => {
        setCertificates(data.certificates);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, []);

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box className="AdminCertificates">
          <Heading fontSize="20px">Certificates</Heading>
          <Box className="table">
            <Table mt="50px" variant="striped" >
              <Thead>
                <Tr>
                  <Th>Student Name</Th>
                  <Th>Certificate Name</Th>
                  <Th>Certificate Type</Th>
                  <Th>Issuing Organization</Th>
                </Tr>
              </Thead>
              <Tbody>
                {certificates.map((certificate) => {
                  return (
                    <Tr key={certificate?._id}>
                      <Td>{certificate?.name}</Td>
                      <Td>{certificate?.certificateName}</Td>
                      <Td>
                        {certificate?.certificateType
                          .slice(0, 1)
                          .toUpperCase() +
                          certificate?.certificateType.slice(1)}
                      </Td>
                      <Td>{certificate?.issuingOrg}</Td>
                      <Td>
                        <Button
                          onClick={() =>
                            navigate(`/certificates/${certificate?._id}`)
                          }
                          mr="20px"
                        >
                          View Certificate
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Certificates;
