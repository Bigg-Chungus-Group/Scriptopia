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
  Image,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";

const FacultyAdd = ({ setModal }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gender, setGender] = React.useState("Male");

  const [fname, setFname] = React.useState("");
  const [lname, setLname] = React.useState("");
  const [moodleid, setMoodleid] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [house, setHouse] = React.useState("");

  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, []);

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
      house: house,
      gender: gender,
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
            <Button colorScheme="blue" mr={3} onClick={setClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addFaculty}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FacultyAdd;
