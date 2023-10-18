import React, { useState, useEffect } from "react";
import Navbar from "../../../components/faculty/Navbar";
import "./Enrollments.css";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  FormLabel,
  Input,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import Loader from "../../../components/Loader";

import { useToast } from "@chakra-ui/react"

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEnrollment, setSelectedEnrollment] = useState();

  const [about, setAbout] = useState();
  const [cgpa, setCgpa] = useState();
  const [technical, setTechnical] = useState();
  const [projects, setProjects] = useState();

  const toast = useToast()

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/enrollments`, {
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
        setEnrollments(data.enrollments);
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

  function truncateText(text, maxLines, maxLength) {
    const lines = text.split("\n");
    if (lines.length > maxLines) {
      const truncatedLines = lines.slice(0, maxLines);
      const truncatedText = truncatedLines.join("\n");
      if (truncatedText.length > maxLength) {
        return truncatedText.slice(0, maxLength) + "...";
      } else {
        return truncatedText;
      }
    } else if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    } else {
      return text;
    }
  }

  const openModal = (id, index) => {
    setSelectedEnrollment(id);
    setAbout(enrollments[index].about);
    setCgpa(enrollments[index].cgpa);
    setTechnical(enrollments[index].technical);
    setProjects(enrollments[index].projects);

    onOpen();
  };

  const acceptDude = () => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADDRESS}/faculty/enrollments/accept`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedEnrollment,
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.error(data);
        setUpdate(!update);
        onClose();
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
  };

  // Example usage within your code:
  if (!loading) {
    return (
      <>
        <Navbar />
        <Flex gap="20px" className="FacultyEnrollments" wrap="wrap">
          {enrollments?.map((enrollment, index) => {
            const truncatedAbout = truncateText(enrollment?.about, 3, 100); // Truncate "about" text to 3 lines and 100 characters
            return (
              <Card
                minW="xs"
                key={enrollment._id}
                cursor="pointer"
                onClick={() => openModal(enrollment?._id, index)}
                alignSelf="center"
              >
                <CardBody>
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Request {index + 1}</Heading>
                    <Text>{truncatedAbout}</Text>
                    <Divider />
                    <Text>TECHNICAL: {enrollment.technical}</Text>
                    <Text>PROJECTS: {enrollment.projects}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      CGPA {enrollment?.cgpa}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            );
          })}
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} size="3xl">
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormLabel>About</FormLabel>
              <Text
                p="10px"
                borderRadius="10px"
                height="150px"
                overflowY="auto"
                mb="20px"
              >
                {about}
              </Text>

              <FormLabel>CGPA</FormLabel>
              <Text
                border="1px solid gray"
                p="10px"
                borderRadius="10px"
                mb="10px"
              >
                {cgpa}
              </Text>

              <Flex gap="20px">
                <Box width="50%">
                  <FormLabel>Technical</FormLabel>
                  <Text
                    border="1px solid gray"
                    p="10px"
                    borderRadius="10px"
                    height="100px"
                    overflowY="auto"
                  >
                    {technical}
                  </Text>
                </Box>

                <Box width="50%">
                  {" "}
                  <FormLabel>Projects</FormLabel>
                  <Text
                    border="1px solid gray"
                    p="10px"
                    borderRadius="10px"
                    height="100px"
                    overflowY="auto"
                  >
                    {projects}
                  </Text>
                </Box>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="green" onClick={acceptDude}>
                Accept
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return <Loader/>
  }
};

export default Enrollments;
