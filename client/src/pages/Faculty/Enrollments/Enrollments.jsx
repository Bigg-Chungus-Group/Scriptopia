import React, { useState, useEffect } from "react";
import Navbar from "../../../components/faculty/Navbar";
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
        console.log(data.enrollments);
      })
      .catch((err) => {
        console.log(err);
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
        console.log(data);
        setUpdate(!update);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Example usage within your code:
  if (!loading) {
    return (
      <>
        <Navbar />
        <Flex p="30px 70px" gap="20px">
          {enrollments.map((enrollment, index) => {
            const truncatedAbout = truncateText(enrollment.about, 3, 100); // Truncate "about" text to 3 lines and 100 characters
            return (
              <Card
                minW="sm"
                key={enrollment._id}
                cursor="pointer"
                onClick={() => openModal(enrollment._id, index)}
              >
                <CardBody>
                  <Stack mt="6" spacing="3">
                    <Heading size="md">Request {index + 1}</Heading>
                    <Text>{truncatedAbout}</Text>
                    <Divider />
                    <Text>TECHNICAL: {enrollment.technical}</Text>
                    <Text>PROJECTS: {enrollment.projects}</Text>
                    <Text color="blue.600" fontSize="2xl">
                      CGPA {enrollment.cgpa}
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
  }
};

export default Enrollments;
