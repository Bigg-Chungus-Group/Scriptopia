import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Image,
  Heading,
  Td,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Input,
  useToast,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

import Intro1 from "../../../assets/img/logo-icon.png";
import "./IntroModal.css";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const IntroModal = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = React.useState(1);

  const {
    isOpen: isOpenAlert,
    onOpen: onOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const [about, setAbout] = React.useState("");
  const [technical, setTechnical] = React.useState("");
  const [projects, setProjects] = React.useState("");
  const [certifications, setCertifications] = React.useState("");
  const [cgpa, setCgpa] = React.useState("");

  const [close, setClose] = React.useState(false);
  const token = Cookies.get("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    if (!close) {
      onOpen();
      setClose(true);
    }
  });

  const incrementPage = () => {
    // ! TODO: CHANGE PAGE NUMBERS

    if (page === 1) {
      setPage(2);
    } else if (page === 2) {
      setPage(4); // ! SET THIS TO THREE
    } else if (page === 3) {
      setPage(4);
    } else if (page === 4) {
      const about = document.getElementById("about").value;
      const technical = document.getElementById("technical").value;
      if (about === "" || technical === "") {
        toast({
          title: "Please fill all the fields",
          status: "error",
          isClosable: true,
        });
        return;
      }
      setPage(5);
    } else if (page === 5) {
      const projects = document.getElementById("projects").value;
      const certifications = document.getElementById("certifications").value;
      const cgpa = document.getElementById("cgpa").value;
      if (projects === "" || certifications === "" || cgpa === "") {
        toast({
          title: "Please fill all the fields",
          status: "error",
          isClosable: true,
        });
        return;
      }

      if (cgpa > 10 || cgpa < 0) {
        toast({
          title: "Please enter a valid CGPA",
          status: "error",
          isClosable: true,
        });
        return;
      }

      onClose();
      document.getElementById("IntroModal").style.display = "none";
      sendData();
    }
  };

  const decrementPage = () => {
    if (page === 1) {
      return;
    } else if (page === 2) {
      setPage(1);
    } else if (page === 3) {
      setPage(2);
    } else if (page === 4) {
      setPage(2); // !Change Page Here
    } else if (page === 5) {
      setPage(4);
    }
  };

  const closeIntro = () => {
    return;
  };

  const sendData = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/student/dashboard/firstTime`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        about,
        technical,
        projects,
        certifications,
        cgpa,
        mid: decoded.mid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onOpenAlert();
        } else {
          toast({
            title: "An Error Occured. Please Try Again After Some Time",
            status: "error",
            isClosable: true,
          });
          setPage(1);
          onOpen();
        }
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          status: "error",
          isClosable: true,
        });
      });
  };

  const logoutAndSave = () => {
    onCloseAlert();
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
    Cookies.remove("token", {
      path: "/",
      domain: import.meta.env.VITE_COOKIE_DOMAIN2,
    });
    window.location.href = "/auth";
  };

  return (
    <Box className="IntroModal" id="IntroModal">
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onclose}
        size="sm"
        scrollBehavior="inside"
        closeOnEsc={false}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent
          minH="80%"
          maxH="80%"
          maxW="80%" // Set the maximum width for the modal content
          w="80%"
        >
          <ModalHeader>Hello!</ModalHeader>

          {page === 1 ? (
            <ModalBody className="IntroModal">
              <Box className="sec1">
                <Heading>Welcome to Scriptopia!</Heading>
                <Box className="Images">
                  {" "}
                  <Image src={Intro1} />
                </Box>
                <Text>
                  Embark on a journey of coding excellence tailored exclusively
                  for our esteemed college community. Scriptopia isn't just a
                  coding platform; it's a dynamic realm where innovation meets
                  competition, where learning meets challenges, and where
                  collaboration meets individual growth. With three distinct
                  sections, we're here to revolutionize the way you approach
                  coding. <span>Click Next to See How</span>
                </Text>
              </Box>
            </ModalBody>
          ) : page === 2 ? (
            <ModalBody className="IntroModal">
              <Box className="sec2">
                <Heading>
                  Your Pathway to Coding Excellence and Collaboration
                </Heading>
                <Box>
                  {" "}
                  <Text>
                    <span>Assignments:</span> Ignite Curiosity Access real-world
                    coding challenges that align with your studies. Complete
                    assignments to earn XP, developing valuable coding skills.
                  </Text>
                  <Text>
                    <span>Practice: </span> Hone your coding mastery through
                    algorithmic puzzles and challenges. Solve problems, earn XP,
                    and enhance your problem-solving abilities.
                  </Text>
                  <Text>
                    <span>Houses</span> Join dynamic Houses, engage in coding
                    events, and test teamwork. Accumulate House Points (HP) and
                    XP for an exciting journey of growth.
                  </Text>
                </Box>
              </Box>
            </ModalBody>
          ) : page === 3 ? (
            <ModalBody className="IntroModal">
              <Box className="sec2">
                <Heading>Points Matrix</Heading>
                <Box className="table-group">
                  <Box className="table">
                    <Text>Solving Practice Problems</Text>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Activity</Th>
                          <Th>Points</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Easy</Td>
                          <Td>+10 XP</Td>
                        </Tr>
                        <Tr>
                          <Td>Medium</Td>
                          <Td>+20 XP</Td>
                        </Tr>
                        <Tr>
                          <Td>Hard</Td>
                          <Td>+30 XP</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>

                  <Box className="table">
                    <Text>Uploading Certifications</Text>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Activity</Th>
                          <Th>Points</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>Beginner</Td>
                          <Td>+50 XP, +10 HP </Td>
                        </Tr>
                        <Tr>
                          <Td>Intermediate</Td>
                          <Td>+75 XP, +25 HP</Td>
                        </Tr>
                        <Tr>
                          <Td>Expert</Td>
                          <Td>+150 XP, +50 HP </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>

                  <Box className="table">
                    <Text> Participation in House Events</Text>
                    <Table variant="striped">
                      <Thead>
                        <Tr>
                          <Th>Activity</Th>
                          <Th>Points</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td>1st Place</Td>
                          <Td>+500 HP, +150 XP</Td>
                        </Tr>
                        <Tr>
                          <Td>2nd Place</Td>
                          <Td>+300 HP, +80 XP </Td>
                        </Tr>
                        <Tr>
                          <Td>3rd Place</Td>
                          <Td>+150 HP, +70 XP</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            </ModalBody>
          ) : page === 4 ? (
            <ModalBody className="IntroModal">
              <Box className="sec3">
                <Heading>A Few Things Before we Get Started</Heading>
                <Alert status="warning">
                  <AlertIcon />
                  Note that you must fill certifications and Technical details
                  correctly as they will be verified by the admin. Your house
                  allotment will be based on this data.
                </Alert>
                <Textarea
                  placeholder="Write a Few Things About Yourself. (Please do not mention anything that could identify you. Ex. Name, Moodle ID)"
                  resize="none"
                  id="about"
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                ></Textarea>
                <Textarea
                  placeholder="Write About Your Technical Skills."
                  resize="none"
                  id="technical"
                  onChange={(e) => setTechnical(e.target.value)}
                  value={technical}
                ></Textarea>
              </Box>
            </ModalBody>
          ) : (
            <ModalBody className="IntroModal">
              <Box className="sec3">
                <Heading>A Few Things Before we Get Started</Heading>
                <Textarea
                  placeholder="List your Project, with a short description of each project seperated by a comma (,)"
                  resize="none"
                  id="projects"
                  onChange={(e) => setProjects(e.target.value)}
                  value={projects}
                ></Textarea>

                <Textarea
                  placeholder="List your Certifications, with every certification seperated by a comma (,)"
                  resize="none"
                  id="certifications"
                  onChange={(e) => setCertifications(e.target.value)}
                  value={certifications}
                ></Textarea>
                <Input
                  type="number"
                  placeholder="Enter your Average CGPA"
                  id="cgpa"
                  onChange={(e) => setCgpa(e.target.value)}
                  value={cgpa}
                />
              </Box>
            </ModalBody>
          )}

          <ModalFooter>
            <Button variant="ghost" onClick={decrementPage}>
              Back
            </Button>
            <Button variant="ghost" onClick={incrementPage}>
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpenAlert}
        leastDestructiveRef={cancelRef}
        onClose={onCloseAlert}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Thankyou
            </AlertDialogHeader>

            <AlertDialogBody>
              You will be logged out of the Portal Now. You can Login once the
              admin verifies your details and you have been alloted a House.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button colorScheme="green" onClick={logoutAndSave} ml={3}>
                Okay
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default IntroModal;
