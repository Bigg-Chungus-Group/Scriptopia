import React, { useEffect } from "react";
import "./FacultyAdd.css";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  Radio,
  RadioGroup,
  Stack,
  Input,
  useToast,
  Checkbox,
  CheckboxGroup,
  List,
  ListItem,
  ListIcon,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useAuthCheck } from "../../../../hooks/useAuthCheck";

const FacultyAdd = ({ setModal, h }) => {
  useAuthCheck("A");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPermOpen,
    onOpen: openPerms,
    onClose: setPermClose,
  } = useDisclosure();
  const [gender, setGender] = React.useState("Male");

  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [moodleid, setMoodleid] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [perms, setPerms] = React.useState([]);
  const [houses, setHouses] = React.useState([]);

  const toast = useToast();

  useEffect(() => {
    setHouses(h.houses);
    onOpen();
  }, []);

  useEffect(() => {
    console.error(perms);
  }, [perms]);

  const setClose = () => {
    setModal(false);
    onClose();
  };

  const addFaculty = () => {
    const data = {
      fname: fname,
      lname: lname,
      moodleid: moodleid,
      email: email,
      gender: gender,
      perms: perms,
    };

    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/admin/faculty/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        setClose();
        toast({
          title: "Faculty Added",
          description: "Faculty has been added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={setClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Faculty</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="StudentModal">
              <Box className="flex">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={fname}
                  onChange={(e) => {
                    setFname(e?.target?.value);
                  }}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lname}
                  onChange={(e) => setLname(e?.target?.value)}
                />
              </Box>
              <Input
                type="text"
                placeholder="Moodle ID"
                value={moodleid}
                onChange={(e) => setMoodleid(e?.target?.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
              />

              <RadioGroup onChange={setGender} value={gender}>
                <Stack direction="row">
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                  <Radio value="Others">Others</Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              colorScheme="red"
              onClick={() => {
                onClose();
                openPerms();
              }}
            >
              Configure Permissions
            </Button>
            <Button colorScheme="blue" mr={3} onClick={setClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addFaculty}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isPermOpen}
        onClose={setPermClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Faculty Permissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckboxGroup>
              <Box overflowX="auto" scrollBehavior="smooth">
                <Table>
                  <Tbody>
                    <CheckboxGroup value={perms} onChange={(e) => setPerms(e)}>
                      <Tr>
                        <Td>
                          <Checkbox value="MHI">Manage Events</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Create Events
                            </ListItem>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Update Events
                            </ListItem>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Manage / Edit Events
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Checkbox value="SND">Send Notifications</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Send Global Notifications to Users
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      {houses.map((house, index) => (
                        <Tr key={index}>
                          <Td>
                            <Checkbox value={`HCO${index}`}>
                              House Coordinator - {house}
                            </Checkbox>
                          </Td>
                          <Td>
                            <List>
                              <ListItem mb={2}>
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                />
                                Manage House Profile
                              </ListItem>
                              <ListItem>
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                />
                                Manage House Members
                              </ListItem>
                            </List>
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td>
                          <Checkbox value="RSP">
                            Reset Student Password
                          </Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Assist in resetting student passwords when
                              necessary
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Checkbox value="AES">Add/Edit Student</Checkbox>
                        </Td>
                        <Td>
                          <List>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Add Students to the system
                            </ListItem>
                            <ListItem mb={2}>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Delete Students from the system
                            </ListItem>
                            <ListItem>
                              <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                              />
                              Edit Student Profiles
                            </ListItem>
                          </List>
                        </Td>
                      </Tr>
                    </CheckboxGroup>
                  </Tbody>
                </Table>
              </Box>
            </CheckboxGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => {
                setPermClose();
                onOpen();
              }}
            >
              Set
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FacultyAdd;
