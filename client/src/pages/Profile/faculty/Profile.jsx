import {
  Avatar,
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Navbar from "../../../components/admin/Navbar";
import "./Profile.css";
import { useToast } from "@chakra-ui/react";

const Profile = () => {
  const toast = useToast();
  const mid = window.location.pathname.split("/")[3];
  const [user, setUser] = React.useState({});
  const [certificates, setCertificates] = React.useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/faculty/${mid}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (res.status === 200) {
          const resp = await res.json();
          setUser(resp.user);
          setCertificates(resp.certifications);
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
  });

  return (
    <>
      <Navbar />

      <Flex p="30px 70px" className="FacultyProfile" gap="20px">
        <Flex alignItems="center" className="left" direction="column">
          <h1>Profile</h1>
          <Avatar size="2xl" />
          <Text mt="20px">
            {user.fname} {user.lname}
          </Text>
          <Text>{user.mid}</Text>

          <Text mt="20px">
            Internal Certifications: {user?.certificates?.internal ?? 0}
          </Text>
          <Text>
            External Certifications: {user?.certificates?.external ?? 0}
          </Text>
        </Flex>
        <Box className="right" overflow="auto">
          <Table variant="striped" colorScheme="teal" overflow="auto">
            <Thead>
              <Tr>
                <Td>Certificate Name</Td>
                <Td>Issuing Org.</Td>
                <Td>Issue Date</Td>
                <Td>Expiry Date</Td>
                <Td>View</Td>
              </Tr>
            </Thead>
            <Tbody>
              {certificates.map((certificate) => (
                <Tr>
                  <Td>{certificate?.certificateName}</Td>
                  <Td>{certificate?.issuingOrg}</Td>
                  <Td>
                    {certificate?.issueMonth} {certificates?.issueYear}
                  </Td>
                  <Td>
                    {certificate?.expiryMonth} {certificates?.expiryYear}
                  </Td>
                  <Td
                    onClick={() => navigate(`/certificates/${certificate._id}`)}
                  >
                    View
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </>
  );
};

export default Profile;
