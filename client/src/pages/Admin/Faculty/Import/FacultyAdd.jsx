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

const FacultyAdd = ({ setModal }) => {
  useAuthCheck("A")
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

  const [VSP, setVSP] = React.useState(false); // View Student Profile
  const [VFI, setVFI] = React.useState(false); // View Faculty Information
  const [MHI, setMHI] = React.useState(false); // Manage House Events
  const [SND, setSND] = React.useState(false); // Send Notifications
  const [GRR, setGRR] = React.useState(false); // Generate Reports
  const [HCO, setHCO] = React.useState(false); // House Coordinator
  const [RSP, setRSP] = React.useState(false); // Reset Student Password
  const [RFP, setRFP] = React.useState(false); // Reset Faculty Password
  const [AES, setAES] = React.useState(false); // Add/Edit Student
  const [AEF, setAEF] = React.useState(false); // Add/Edit Faculty

  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, []);

  const setClose = () => {
    setModal(false);
    onClose();
  };

  const stateArray = [];

  useEffect(() => {
    if (VSP) {
      stateArray.push("VSP"); // Push 'VSP' if it is true
    }

    if (VFI) {
      stateArray.push("VFI"); // Push 'VFI' if it is true
    }

    if (MHI) {
      stateArray.push("MHI"); // Push 'MHI' if it is true
    }

    if (SND) {
      stateArray.push("SND"); // Push 'SND' if it is true
    }

    if (GRR) {
      stateArray.push("GRR"); // Push 'GRR' if it is true
    }

    if (HCO) {
      stateArray.push("HCO"); // Push 'HCO' if it is true
    }

    if (RSP) {
      stateArray.push("RSP"); // Push 'RSP' if it is true
    }

    if (RFP) {
      stateArray.push("RFP"); // Push 'RFP' if it is true
    }

    if (AES) {
      stateArray.push("AES"); // Push 'AES' if it is true
    }

    if (AEF) {
      stateArray.push("AEF"); // Push 'AEF' if it is true
    }

    // Now, stateArray contains the names of the states that are true
    console.log(stateArray);
  }, [VSP, VFI, MHI, SND, GRR, HCO, RSP, RFP, AES, AEF]);

  const addFaculty = () => {
    const data = {
      fname: fname,
      lname: lname,
      moodleid: moodleid,
      email: email,
      house: house,
      gender: gender,
      perms: stateArray
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
                    setFname(e.target.value);
                  }}
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </Box>
              <Input
                type="text"
                placeholder="Moodle ID"
                value={moodleid}
                onChange={(e) => setMoodleid(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button mr={3} colorScheme="red" onClick={openPerms}>
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

      <Modal isOpen={isPermOpen} onClose={setPermClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Faculty Permissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CheckboxGroup>
              <Box overflowX="auto" scrollBehavior="smooth" height="55vh">
                <Table>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setVSP(e.target.value)}
                          value={VSP}
                        >
                          Access Student Profile
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Access Students profiles
                          </ListItem>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Access Students Contact
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Access Students Event History
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setVFI(e.target.value)}
                          value={VFI}
                        >
                          View Faculty Information
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Access Faculty Profiles
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Access Faculty Contact
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setMHI(e.target.value)}
                          value={MHI}
                        >
                          Manage House Events
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Create House Events
                          </ListItem>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Update House Events
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage / Edit House Events
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setSND(e.target.value)}
                          value={SND}
                        >
                          Send Notifications
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Send Global Notifications to Users
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setGRR(e.target.value)}
                          value={GRR}
                        >
                          Generate Reports
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Create Reports and Analytics
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setHCO(e.target.value)}
                          value={HCO}
                        >
                          House Coordinator
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage House Profile
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage House Members
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setRSP(e.target.value)}
                          value={RSP}
                        >
                          Reset Student Password
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Assist in resetting student passwords when necessary
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setRFP(e.target.value)}
                          value={RFP}
                        >
                          Reset Faculty Password
                        </Checkbox>
                      </Td>
                      <Td>
                        {" "}
                        <List>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Assist in resetting faculty passwords when necessary
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setAES(e.target.value)}
                          value={AES}
                        >
                          Add/Edit Student
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Add Students to the system
                          </ListItem>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Delete Students from the system
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Edit Student Profiles
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>

                    <Tr>
                      <Td>
                        <Checkbox
                          onChange={(e) => setAEF(e.target.value)}
                          value={AEF}
                        >
                          Add/Edit Faculty
                        </Checkbox>
                      </Td>
                      <Td>
                        <List>
                          <ListItem mb={2}>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Add Faculty to the system
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Delete Faculty from the system
                          </ListItem>
                        </List>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </CheckboxGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={setPermClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addFaculty}>
              Set
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FacultyAdd;
