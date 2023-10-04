import React, { useEffect, useState } from "react";
import Navbar from "../../../components/faculty/Navbar";
import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Textarea,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const [selectedCertificate, setSelectedCertificate] = useState();
  const [action, setAction] = useState();
  const [xp, setXp] = useState(0);
  const [comments, setComments] = useState();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/certificates`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCertificates(data.certs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [update]);

  const openCert = (id) => {
    setSelectedCertificate(id);
    onOpen();
  };

  const updateCert = () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/certificates/update`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedCertificate,
          action: action,
          xp: parseInt(xp),
          comments: comments,
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setUpdate(!update);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!loading) {
    return (
      <>
        <Navbar />
        <Box p="30px 70px">
          <Heading fontSize="20px">Pending Certificates</Heading>
          <Table mt="50px" variant="striped">
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
                      {certificate?.certificateType.slice(0, 1).toUpperCase() +
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
                      <Button
                        colorScheme="green"
                        onClick={() => openCert(certificate?._id)}
                      >
                        Accept / Reject
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select
                placeholder="Choose a Action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="approved">Accept Certificate</option>
                <option value="rejected">Reject Certificate</option>
              </Select>

              {action === "approved" ? (
                <Select
                  mt="20px"
                  placeholder="Allocate XP"
                  value={xp}
                  onChange={(e) => setXp(e.target.value)}
                >
                  <option value="30">30 XP</option>
                  <option value="50">50 XP</option>
                  <option value="60">60 XP</option>
                </Select>
              ) : null}

              <Textarea
                mt="20px"
                placeholder="Add Comments"
                comments={xp}
                onChange={(e) => setComments(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost" onClick={updateCert}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
};

export default Certificates;
